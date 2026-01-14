from server.app.app import create_app
from server.app.extensions import db
from server.app.models import (
    User, Role, Event, EventRegistration, Order, Payment, Ticket, TicketType
)
from datetime import datetime, timedelta, timezone

app = create_app()

with app.app_context():
    # Clear data in reverse dependency order
    Ticket.query.delete()
    TicketType.query.delete()
    Payment.query.delete()
    Order.query.delete()
    EventRegistration.query.delete()
    Event.query.delete()
    User.query.delete()
    Role.query.delete()
    db.session.commit()

    # Create roles
    admin_role = Role(name="admin")
    attendee_role = Role(name="attendee")
    db.session.add_all([admin_role, attendee_role])
    db.session.commit()

    # Create users
    admin = User(
        username="admin", email="admin@example.com", phone="1234567890",
        password_hash="hashed_pw", role_id=admin_role.id
    )
    user = User(
        username="user1", email="user1@example.com", phone="0987654321",
        password_hash="hashed_pw", role_id=attendee_role.id
    )
    db.session.add_all([admin, user])
    db.session.commit()

    # Create an event
    event1 = Event(
        organizer_id=admin.id,
        title="Launch Party",
        description="Event360 Launch",
        venue="Nairobi",
        start_time=datetime.now(timezone.utc) + timedelta(days=7),
        end_time=datetime.now(timezone.utc) + timedelta(days=7, hours=3),
        status="approved"
    )
    db.session.add(event1)
    db.session.commit()

    # Create ticket types for the event
    general_ticket = TicketType(
        event_id=event1.id,
        name="General Admission",
        price=50.00,
        quantity_total=100
    )
    vip_ticket = TicketType(
        event_id=event1.id,
        name="VIP",
        price=100.00,
        quantity_total=50
    )
    db.session.add_all([general_ticket, vip_ticket])
    db.session.commit()

    # Create event registration
    reg1 = EventRegistration(
        user_id=user.id,
        event_id=event1.id,
        quantity=2,
        registered_at=datetime.now(timezone.utc)
    )
    db.session.add(reg1)
    db.session.commit()

    # Create an order
    order1 = Order(
        user_id=user.id,
        event_id=event1.id,
        total_amount=100.00,
        payment_status='completed'
    )
    db.session.add(order1)
    db.session.commit()

    # Create a payment
    payment1 = Payment(
        order_id=order1.id,
        provider='mpesa',
        provider_ref='TXN123456',
        status='success'
    )
    db.session.add(payment1)
    db.session.commit()

    # Create tickets linked to ticket types
    ticket1 = Ticket(order_id=order1.id, ticket_type_id=general_ticket.id, code='TKT-ABC123', status='valid')
    ticket2 = Ticket(order_id=order1.id, ticket_type_id=general_ticket.id, code='TKT-DEF456', status='valid')
    db.session.add_all([ticket1, ticket2])
    db.session.commit()

    print("Seeded roles, users, events, ticket types, registrations, orders, payments, and tickets successfully!")
