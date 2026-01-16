
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from .extensions import db
import uuid

class Role(db.Model):
    __tablename__ = "roles"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    users = db.relationship("User", back_populates="role")
    
    @staticmethod
    def create_default_roles():
        """Create default roles if they don't exist"""
        default_roles = ['user', 'organizer', 'admin']
        for role_name in default_roles:
            if not Role.query.filter_by(name=role_name).first():
                role = Role(name=role_name)
                db.session.add(role)
        db.session.commit()

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"), nullable=False, default=3)  # Default to attendee
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    avatar_url = db.Column(db.String(255))

    role = db.relationship("Role", back_populates="users")
    events = db.relationship("Event", back_populates="organizer")
    orders = db.relationship("Order", back_populates="user")
    registrations = db.relationship("EventRegistration", back_populates="user")
    event_approvals = db.relationship("EventApproval", back_populates="admin")
    reviews = db.relationship("Review", back_populates="user")
    wishlist_items = db.relationship("Wishlist", back_populates="user")
    notifications = db.relationship("Notification", back_populates="user")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'role_id': self.role_id,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }

class Event(db.Model):
    __tablename__ = "events"
    
    id = db.Column(db.Integer, primary_key=True)
    organizer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    venue = db.Column(db.String(200))
    address = db.Column(db.String(500))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    category = db.Column(db.String(100))
    status = db.Column(db.String(50), default='pending')  
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, onupdate=lambda: datetime.now(timezone.utc))
    poster_url = db.Column(db.String(255))
    banner_url = db.Column(db.String(255))
    capacity = db.Column(db.Integer)
    is_public = db.Column(db.Boolean, default=True)

    organizer = db.relationship("User", back_populates="events")
    orders = db.relationship("Order", back_populates="event")
    event_approvals = db.relationship("EventApproval", back_populates="event")
    registrations = db.relationship("EventRegistration", back_populates="event")
    ticket_types = db.relationship("TicketType", back_populates="event")
    reviews = db.relationship("Review", back_populates="event")
    wishlist_items = db.relationship("Wishlist", back_populates="event")

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'venue': self.venue,
            'city': self.city,
            'country': self.country,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat(),
            'category': self.category,
            'status': self.status,
            'organizer_id': self.organizer_id,
            'organizer_name': self.organizer.username if self.organizer else None,
            'poster_url': self.poster_url,
            'banner_url': self.banner_url,
            'capacity': self.capacity,
            'created_at': self.created_at.isoformat()
        }

class EventApproval(db.Model):
    __tablename__ = "event_approvals"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    status = db.Column(db.String(50), nullable=False)  # approved, rejected
    comment = db.Column(db.Text)
    decided_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    event = db.relationship("Event", back_populates="event_approvals")
    admin = db.relationship("User", back_populates="event_approvals")

class TicketType(db.Model):
    __tablename__ = "ticket_types"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity_total = db.Column(db.Integer, nullable=False)
    quantity_sold = db.Column(db.Integer, default=0)
    sale_start = db.Column(db.DateTime)
    sale_end = db.Column(db.DateTime)
    access_level = db.Column(db.String(50), default="general")
    is_active = db.Column(db.Boolean, default=True)
    max_per_user = db.Column(db.Integer, default=10)

    event = db.relationship("Event", back_populates="ticket_types")
    tickets = db.relationship("Ticket", back_populates="ticket_type")
    order_items = db.relationship("OrderItem", back_populates="ticket_type")

    @property
    def available_quantity(self):
        return self.quantity_total - self.quantity_sold

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_status = db.Column(db.String(50), default='pending')  # pending, completed, failed, refunded
    order_status = db.Column(db.String(50), default='processing')  # processing, confirmed, cancelled
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, onupdate=lambda: datetime.now(timezone.utc))
    reference = db.Column(db.String(100), unique=True, default=lambda: f"ORD-{uuid.uuid4().hex[:8].upper()}")

    user = db.relationship("User", back_populates="orders")
    event = db.relationship("Event", back_populates="orders")
    payment = db.relationship("Payment", back_populates="order", uselist=False)
    tickets = db.relationship("Ticket", back_populates="order")
    order_items = db.relationship("OrderItem", back_populates="order")

class OrderItem(db.Model):
    __tablename__ = "order_items"
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    ticket_type_id = db.Column(db.Integer, db.ForeignKey("ticket_types.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    
    order = db.relationship("Order", back_populates="order_items")
    ticket_type = db.relationship("TicketType", back_populates="order_items")

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    provider = db.Column(db.String(50))  # mpesa, stripe, paypal
    provider_ref = db.Column(db.String(100))
    amount = db.Column(db.Numeric(10, 2))
    status = db.Column(db.String(50), default='pending')  # pending, successful, failed
    raw_payload = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    order = db.relationship("Order", back_populates="payment")

class Ticket(db.Model):
    __tablename__ = "tickets"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    ticket_type_id = db.Column(db.Integer, db.ForeignKey("ticket_types.id"), nullable=False)
    code = db.Column(db.String(100), unique=True, nullable=False, default=lambda: f"TKT-{uuid.uuid4().hex[:12].upper()}")
    qr_image_url = db.Column(db.String(255))
    status = db.Column(db.String(50), default="valid")  # valid, used, cancelled
    checked_in_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    order = db.relationship("Order", back_populates="tickets")
    ticket_type = db.relationship("TicketType", back_populates="tickets")

class EventRegistration(db.Model):
    __tablename__ = "event_registrations"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    registration_type = db.Column(db.String(50), default="general")  # USER SUBMITTABLE ATTRIBUTE for many-to-many
    notes = db.Column(db.Text)  # USER SUBMITTABLE ATTRIBUTE for many-to-many
    registered_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, onupdate=lambda: datetime.now(timezone.utc))

    user = db.relationship("User", back_populates="registrations")
    event = db.relationship("Event", back_populates="registrations")

    __table_args__ = (
        db.UniqueConstraint('user_id', 'event_id', name='unique_user_event_registration'),
    )

class Review(db.Model):
    __tablename__ = "reviews"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = db.relationship("User", back_populates="reviews")
    event = db.relationship("Event", back_populates="reviews")
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'event_id', name='unique_user_event_review'),
    )

class Wishlist(db.Model):
    __tablename__ = "wishlists"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = db.relationship("User", back_populates="wishlist_items")
    event = db.relationship("Event", back_populates="wishlist_items")
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'event_id', name='unique_user_event_wishlist'),
    )

class Notification(db.Model):
    __tablename__ = "notifications"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text)
    type = db.Column(db.String(50))  # event_approved, payment_success, etc.
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = db.relationship("User", back_populates="notifications")