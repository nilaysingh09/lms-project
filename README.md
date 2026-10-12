🎓 LearnHub – Learning Management System (LMS)

LearnHub is a web-based Learning Management System designed to make online education more accessible and organized. It provides a platform for managing courses, accessing lectures, tracking enrollments, completing quizzes and assignments, and earning certificates.

🌐 Live Demo: https://learnhub9601.vercel.app

💻 GitHub Repository: https://github.com/nilaysingh09/lms-project

✨ Features
🔐 User Authentication – Secure authentication using JSON Web Tokens (JWT).
📚 Course Management – Manage and explore educational courses.
🎥 Lecture Management – Organize and access course lectures.
📝 Assignments – Manage course assignments.
🧠 Quizzes – Support learning assessments through quizzes.
📈 Course Enrollment – Manage student course enrollments.
🏆 Certificates – Certificate-related functionality for learners.
☁️ Cloud Media Storage – Cloudinary integration for media management.
📱 Web-Based Interface – A React frontend for interacting with the platform.
🛠️ Tech Stack
Technology	Purpose
React.js	Frontend user interface
React Router	Client-side navigation
Node.js	Backend runtime
Express.js	REST API and server
MongoDB	Database
Mongoose	Database modeling
JWT	Authentication
bcryptjs	Password hashing
Cloudinary	Media management
Axios	HTTP requests
📂 Project Structure
lms-project/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   └── package.json
│
├── server/                 # Node.js and Express backend
│   ├── config/             # Database configuration
│   ├── routes/             # API routes
│   ├── index.js            # Server entry point
│   └── package.json
│
├── .gitignore
└── README.md

🚀 Getting Started

Follow these steps to run the project locally.

Prerequisites

Make sure you have installed:

Node.js
npm (included with Node.js)
MongoDB or a MongoDB Atlas database
1. Clone the repository
git clone https://github.com/nilaysingh09/lms-project.git
cd lms-project

2. Set up the backend

Navigate to the server directory and install the dependencies.

cd server
npm install


Create a .env file inside the server directory and configure your MongoDB connection string and any required authentication or Cloudinary credentials according to the server configuration.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Use the exact environment variable names expected by your application code. Add Cloudinary credentials if required by the media-upload functionality.

Start the backend server:

npm start


The server uses port 5000 by default unless another port is configured.

3. Set up the frontend

Open a new terminal and navigate to the project directory.

cd lms-project/client
npm install


Configure the frontend API base URL if required so it points to your running backend.

Start the React development server:

npm start

4. Open the application

Open the local URL displayed in your frontend terminal, typically:

http://localhost:3000


Make sure the backend and database are running before using features that require server access.

🔌 Backend API Modules

The backend exposes API routes for the following modules:

Module	Base route
Authentication	/api/auth
Courses	/api/courses
Lectures	/api/lectures
Enrollments	/api/enroll
Assignments	/api/assignments
Quizzes	/api/quizzes
Certificates	/api/certificates

These routes are registered by the Express server. Refer to the individual route files for available endpoints and request formats.

🔒 Security
JWT-based authentication support.
Password hashing support using bcryptjs.
Environment variables for configuration and secrets.
Keep database credentials, API keys, and authentication secrets private.
Never commit your .env files to GitHub.


🔮 Future Improvements

Potential enhancements for the platform include:

Progress tracking and personalized learning dashboards.
Course ratings and reviews.
Notifications and reminders.
Advanced analytics for instructors.
Responsive UI improvements and accessibility enhancements.
🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

Fork the repository.
Create a new branch.
Make your changes.
Commit and push your changes.
Open a pull request.
📄 License

Please check the repository for its existing license. If no license is provided, contact the repository owner before redistributing or reusing the code.

Developed by Nilay Singh

⭐ If you find this project useful, consider giving the repository a star!
