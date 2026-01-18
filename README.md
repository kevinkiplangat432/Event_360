# EVENT360 

Event360 is a comprehensive full-stack event management platform that revolutionizes how events are created, managed, and experienced. Built with modern web technologies, it provides a seamless experience for event organizers, attendees, and administrators.

##### admin login
- Email: admin@eventhub.com
- Password: admin123!

## Live Application
**Frontend**: https://event-360.vercel.app/  
**Backend API**: https://event-360-qm8m.onrender.com

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Features
- **Event Management**: Create, edit, and manage events with rich details
- **User Authentication**: Secure JWT-based authentication system
- **Role-Based Access**: Admin, Organizer, and Attendee roles with specific permissions
- **Event Discovery**: Advanced search and filtering capabilities
- **Image Upload**: Cloudinary integration for event posters and banners
- **Real-time Updates**: Dynamic event status and user management
- **Responsive Design**: Mobile-first, modern UI with dark/light themes

### User Features
- **Event Browsing**: Discover events with advanced search and filters
- **Event Slideshow**: Featured events carousel on homepage
- **User Profiles**: Customizable user profiles with avatar support
- **Wishlist**: Save favorite events for later
- **Event Reviews**: Rate and review attended events
- **Notifications**: Real-time updates on event status and activities

###  Admin Features
- **User Management**: View, edit user roles and status
- **Event Approval**: Review and approve/reject pending events
- **Analytics Dashboard**: Comprehensive statistics and insights
- **Order Management**: View and manage all platform orders
- **System Monitoring**: Track platform usage and performance

###  Organizer Features
- **Event Creation**: Rich event creation with multiple ticket types
- **Event Analytics**: Track registrations and engagement
- **Attendee Management**: View and manage event registrations
- **Event Updates**: Real-time event information updates

##  Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Build Tool**: Vite for fast development and building

### Backend
- **Framework**: Flask (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary integration
- **Migrations**: Flask-Migrate
- **CORS**: Flask-CORS for cross-origin requests
- **Password Hashing**: Flask-Bcrypt
- **Production Server**: Gunicorn

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: Render PostgreSQL
- **File Storage**: Cloudinary
- **Version Control**: Git/GitHub

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│   Flask API     │────│   PostgreSQL    │
│   (Vercel)      │    │   (Render)      │    │   (Render)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Cloudinary    │
                    │  (File Storage) │
                    └─────────────────┘
```

## Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/kevinkiplangat432/Event_360.git
cd Event_360
```

2. **Create virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
cd server
pip install -r requirements.txt
```

4. **Environment Configuration**
Create `.env` file in project root:
```env
FLASK_ENV=development
FLASK_APP=server:create_app
DATABASE_URL=postgresql://username:password@localhost:5432/event360_db
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

5. **Database Setup**
```bash
cd ..
export FLASK_APP=server:create_app
flask db upgrade
python server/seed/seed_data.py  # Optional: seed with sample data
```

6. **Run Backend Server**
```bash
flask run
# Server runs on http://127.0.0.1:5000
```

### Frontend Setup

1. **Install dependencies**
```bash
cd client
npm install
```

2. **Environment Configuration** (Optional)
Create `.env` file in client directory:
```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

3. **Run Development Server**
```bash
npm run dev
# Client runs on http://localhost:5173
```

## API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
POST /api/auth/logout      # User logout
```

### Event Endpoints
```
GET    /api/events              # Get all events (with filters)
GET    /api/events/{id}         # Get event by ID
POST   /api/events              # Create new event
PUT    /api/events/{id}         # Update event
DELETE /api/events/{id}         # Delete event
POST   /api/events/{id}/reviews # Create event review
```

### Admin Endpoints
```
GET /api/users                    # Get all users
PUT /api/admin/users/{id}/role    # Update user role
PUT /api/admin/users/{id}/status  # Toggle user status
GET /api/admin/statistics         # Get platform analytics
GET /api/admin/orders             # Get all orders
```

### File Upload
```
POST /api/upload    # Upload image to Cloudinary
```

## User Roles

### Admin
- Full platform access
- User management (roles, status)
- Event approval/rejection
- Platform analytics
- Order management

**Default Admin Credentials:**
- Email: `admin@eventhub.com`
- Password: `admin123!`

### Organizer
- Create and manage events
- View event analytics
- Manage attendee registrations
- Upload event media

### Attendee
- Browse and search events
- Register for events
- Leave reviews and ratings
- Manage personal wishlist

## Contributing

### Team Members

**Backend Development:**
- **Kevin Kiplangat** - Lead Backend Developer
- **Festus Kisoi** - Backend Developer

*Responsibilities: API design, database architecture, authentication, business logic*

**Frontend Development:**
- **Sylvia Malala** - Lead Frontend Developer  
- **Wise Munene** - Frontend Developer

*Responsibilities: UI/UX implementation, state management, API integration*

### Development Workflow
1. **Feature Branches**: Create feature-specific branches
2. **Pull Requests**: All changes via reviewed PRs
3. **Code Standards**: Follow established coding conventions
4. **Testing**: Ensure all features are tested
5. **Documentation**: Update docs for new features

### Getting Started
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Deployment

### Production Environment
- **Frontend**: Deployed on Vercel with automatic deployments
- **Backend**: Deployed on Render with Docker containerization
- **Database**: Render PostgreSQL with automated backups
- **CDN**: Cloudinary for optimized image delivery

### Environment Variables (Production)
```env
FLASK_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
CORS_ORIGINS=https://event-360.vercel.app
# ... other production configs
```

##  License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2024 Event360 Team

---

**Built with ❤️ by the Event360 Team**