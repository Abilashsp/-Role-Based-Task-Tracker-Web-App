Role-Based Task Tracker web app

A MERN Stack application with Role-Based Access Control (RBAC), where:
✅ Admin can manage users (view, edit, delete) and assign tasks.
✅ Members can view and manage their own tasks.

Built using MongoDB, Express.js, React, Node.js, and Tailwind CSS for a modern and responsive UI.

✨ Features
✅ Authentication & Authorization

JWT-based authentication for secure login.

Role-based access control (Admin & Member).

✅ User Management (Admin)

View all users.

Edit user details.

Delete users.

✅ Task Management

Admin can assign tasks to members.

Members can view their own tasks.

Update task status (Pending, In Progress, Completed).

✅ Other Features

Responsive UI with Tailwind CSS.

Protected Routes based on roles.

📂 Project Structure
role-based-task-tracker/
├── backend/        # Express.js + MongoDB API
├── frontend/       # React + Tailwind CSS UI
└── README.md

🛠 Tech Stack

Frontend: React, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT

🚀 Getting Started
1. Clone the repository
git clone https://github.com/Abilashsp/-Role-Based-Task-Tracker-Web-App.git
cd role-based-task-tracker

2. Setup Backend
cd backend
npm install


Create a .env file inside backend with the following:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Start the backend server:

npm start

3. Setup Frontend
cd ../frontend
npm install
npm start

🔐 User Roles
Admin

View all users.

Add / Edit / Delete users.

Assign tasks to members.

Member

View own tasks.

Update task status.
