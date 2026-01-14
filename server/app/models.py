from datetime import datetime
from extensions import db


class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    role = db.relationship("Role", back_populates="users")
    events = db.relationship("Event", back_populates="organizer")
    orders = db.relationship("Order", back_populates="user")
    registrations = db.relationship("EventRegistration", back_populates="user")
    event_approvals = db.relationship("EventApproval", back_populates="admin")  


class Role(db.Model):
    __tablename__ = "roles"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    users = db.relationship("User", back_populates="role")

class Event(db.Model):
    __tablename__ = "events"
    
    id = db.Column(db.Integer, primary_key=True)
    organizer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    venue = db.Column(db.String(200))
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(datetime.timezone.utc))

    organizer = db.relationship("User", back_populates="events")
    orders = db.relationship("Order", back_populates="event")
    event_approvals = db.relationship("EventApproval", back_populates="event")
    registrations = db.relationship("EventRegistration", back_populates="event")
    ticket_types = db.relationship("TicketType", back_populates="event")


class EventApproval(db.Model):
    __tablename__ = "event_approvals"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    comment = db.Column(db.Text)
    decided_at = db.Column(db.DateTime, default=lambda: datetime.now(datetime.timezone.utc))

    event = db.relationship("Event", back_populates="event_approvals")
    admin = db.relationship("User", back_populates="event_approvals")


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    total_amount = db.Column(db.Numeric, nullable=False)
    payment_status = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(datetime.timezone.utc))

    user = db.relationship("User", back_populates="orders")
    event = db.relationship("Event", back_populates="orders")
    payment = db.relationship("Payment", back_populates="order", uselist=False)
    tickets = db.relationship("Ticket", back_populates="order")


class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    provider = db.Column(db.String(50))
    provider_ref = db.Column(db.String(100))
    status = db.Column(db.String(50))
    raw_payload = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(datetime.timezone.utc))

    order = db.relationship("Order", back_populates="payment")


class EventRegistration(db.Model):
    __tablename__ = "event_registrations"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    registered_at = db.Column(db.DateTime, default=lambda: datetime.now(datetime.timezone.utc))

    user = db.relationship("User", back_populates="registrations")
    event = db.relationship("Event", back_populates="registrations")
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'event_id', name='unique_user_event_registration'),
    )


class Ticket(db.Model):
    __tablename__ = "tickets"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    code = db.Column(db.String(100), unique=True, nullable=False)
    status = db.Column(db.String(50), default="valid")
    checked_in_at = db.Column(db.DateTime)

    order = db.relationship("Order", back_populates="tickets")


class TicketType(db.Model):
    __tablename__ = "ticket_types"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    name = db.Column(db.String(50))
    price = db.Column(db.Numeric, nullable=False)
    quantity_total = db.Column(db.Integer)

    event = db.relationship("Event", back_populates="ticket_types")

