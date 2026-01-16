# EVENT360
Event360 is a full-stack web application designed to manage events, ticketing, and user interactions in a modern, scalable way.
The project follows a client–server architecture, with a React frontend and a Python (Flask) backend.


### live at https://event-360.vercel.app/



### Tech Stack

#### Frontend (Client)

React (Vite)

React Router

CSS / Tailwind (if applicable)

REST API consumption

#### Backend (Server)

Python

Flask

SQLAlchemy

Flask-Migrate

JWT Authentication

SQLite / PostgreSQL (configurable)

#### Key Features

User authentication & authorization

Event creation and management

Ticket types and registrations

Secure API endpoints

Responsive and modern UI

Role-based access control

### Contributors & Roles
##### Backend (Server)

Kevin Kiplangat

Festus Kisoi

Responsible for API design, database modeling, authentication, and business logic.

##### Frontend (Client)

Sylvia Malala

Wise Munene

Responsible for UI/UX implementation, routing, state handling, and API integration.

# Setup & Installation
# Backend Setup
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
python seed.py
python app/app.py


# Server runs on:

http://127.0.0.1:5000

# Frontend Setup
cd client
npm install
npm run dev


# Client runs on:

http://localhost:5173

#  Environment Variables

Create a .env file in both client and server as needed:

DATABASE_URL=
SECRET_KEY=
JWT_SECRET_KEY=

# Collaboration Workflow

Feature-based branching

Pull requests with reviews

Clear commit messages

Shared API contract between client & server

# License

MIT License

Copyright (c) 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.