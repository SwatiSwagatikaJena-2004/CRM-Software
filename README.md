# CRM Software

A Customer Relationship Management (CRM) web application built using the MERN stack to manage customers, leads, tasks, sales records, and sales pipeline stages.

## Features

- User registration and login
- JWT-based authentication
- Role-based Admin and Sales Rep interface
- Customer management
- Lead management
- Task management
- Sales record management
- Interactive sales pipeline with stage updates
- Dashboard with CRM statistics
- MongoDB database integration
- REST API backend

## Technologies Used

- Frontend: React, JavaScript, HTML, CSS
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JSON Web Tokens (JWT)
- API testing: Postman
- API documentation: Swagger

## Project Structure

CRM-Software/
├── backend/
└── frontend/

## Prerequisites

- Node.js and npm
- MongoDB
- A web browser

## Getting Started

### 1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL

### 2. Start the backend

cd backend
npm install

Create a `.env` file inside the backend folder and configure:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/crm_database
JWT_SECRET=replace_with_a_secure_secret

Start the backend using the start command configured in package.json.

### 3. Start the frontend

Open a second terminal:

cd frontend
npm install
npm run dev

Open the local URL displayed in the terminal.

## Future Improvements

- More detailed sales analytics
- Search, sorting, and filtering
- Improved responsive design
- Automated tests
- Stronger server-side role permissions
-