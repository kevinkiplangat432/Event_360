#!/usr/bin/env python3
"""
Check Events in Database
"""

import os
import sys

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server import create_app
from server.extensions import db
from server.models import Event, User, Role

def check_events():
    """Check what events exist in database"""
    app = create_app()
    
    with app.app_context():
        try:
            print("🔍 Checking events in database...")
            
            events = Event.query.all()
            print(f"📊 Found {len(events)} events total")
            
            if events:
                print("\n📋 Events list:")
                for event in events:
                    organizer = User.query.get(event.organizer_id)
                    print(f"  - ID: {event.id}")
                    print(f"    Title: {event.title}")
                    print(f"    Status: {event.status}")
                    print(f"    Category: {event.category}")
                    print(f"    Organizer: {organizer.username if organizer else 'Unknown'}")
                    print(f"    Created: {event.created_at}")
                    print(f"    Start: {event.start_time}")
                    print("    ---")
                
                # Count by status
                status_counts = {}
                for event in events:
                    status_counts[event.status] = status_counts.get(event.status, 0) + 1
                
                print(f"\n📈 Events by status:")
                for status, count in status_counts.items():
                    print(f"  - {status}: {count}")
            else:
                print("❌ No events found in database")
                
            # Check users and roles
            users = User.query.all()
            print(f"\n👥 Found {len(users)} users:")
            for user in users:
                role = Role.query.get(user.role_id)
                print(f"  - {user.username} ({user.email}) - Role: {role.name if role else 'Unknown'}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    check_events()