# EVENT360
Event360 is a full-stack web application designed to manage events, ticketing, and user interactions in a modern, scalable way.
The project follows a client–server architecture, with a React frontend and a Python (Flask) backend.

# 🧩 Project Architecture
Event360/
│
├── client/        # Frontend (React)
│   ├── src/
│   └── package.json
│
├── server/        # Backend (Flask)
│   ├── app/
│   ├── models.py
│   ├── routes/
│   └── seed.py
│
└── README.md

#  🛠 Tech Stack

# Frontend (Client)

React (Vite)

React Router

CSS / Tailwind (if applicable)

REST API consumption

# Backend (Server)

Python

Flask

SQLAlchemy

Flask-Migrate

JWT Authentication

SQLite / PostgreSQL (configurable)

# ✨ Key Features

User authentication & authorization

Event creation and management

Ticket types and registrations

Secure API endpoints

Responsive and modern UI

Role-based access control

# 🧑‍💻 Contributors & Roles
# Backend (Server)

Kevin Kiplangat

Festus Kisoi

Responsible for API design, database modeling, authentication, and business logic.

# Frontend (Client)

Sylvia Malala

Wise Munene

Responsible for UI/UX implementation, routing, state handling, and API integration.

# ⚙️ Setup & Installation
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

# 🔐 Environment Variables

Create a .env file in both client and server as needed:

DATABASE_URL=
SECRET_KEY=
JWT_SECRET_KEY=

# 📌 Collaboration Workflow

Feature-based branching

Pull requests with reviews

Clear commit messages

Shared API contract between client & server

# 📄 License

This project is licensed under the MIT License.