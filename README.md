Real-Time Chat Application (chat_final)

A full-stack Real-Time Chat Application built using Socket.io, Node.js, Express, and React.

This application provides complete user authentication, profile management, and real-time messaging functionality. It is designed to demonstrate full-stack development skills including authentication flow, socket communication, state management, and database integration.

⸻

🚀 Features

🔐 Authentication System

• User Registration (Sign Up)
• Secure Login
• Forgot Password functionality
• Password Reset
• Secure password hashing using bcrypt
• Token-based authentication using JWT
• Protected routes

⸻

💬 Real-Time Messaging

• Instant message delivery using Socket.io
• Bi-directional communication
• Live chat updates without refreshing
• Active users support
• Real-time socket connection handling

⸻

👤 Profile Management

• Update username and email
• Upload & update profile picture
• Edit user information
• View profile details

⸻

🎨 User Interface

• Clean and responsive UI
• Smooth user experience
• Organized chat layout
• Sidebar for users
• Easy navigation between chat and profile

⸻

🧠 Tech Stack

Frontend

• React.js
• Axios (API calls)
• Socket.io-client

Backend

• Node.js
• Express.js
• Socket.io
• JWT (Authentication)
• bcrypt (Password hashing)

Database

• MongoDB (Update if different in your project)

⸻

📁 Project Structure

chat_final/
• backend/ – Express server & APIs
• frontend/ – React application
• package.json
• README.md

⸻

⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/saloni259/chat_final.git
cd chat_final

⸻

2️⃣ Install Dependencies

Backend:

cd backend
npm install

Frontend:

cd ../frontend
npm install

⸻

3️⃣ Setup Environment Variables

Create a .env file inside the backend folder.

Example:

PORT=5000
MONGO_URI=your_database_connection_string
JWT_SECRET=your_secret_key

Replace the values with your own credentials.

⸻

4️⃣ Run the Application

Start Backend Server:

cd backend
npm run dev

Start Frontend:

cd ../frontend
npm start

⸻

🌐 Application URLs

Frontend
• http://localhost:3000

Backend
• http://localhost:5000

⸻

🔎 Application Flow

🔐 Authentication Flow

• User registers with email & password
• Password is hashed before storing in database
• JWT token is generated after successful login
• Protected routes require valid token
• Forgot password enables secure reset

⸻

💬 Real-Time Chat Flow

• User connects to Socket.io server
• Server listens for message events
• Messages are emitted instantly
• No page refresh required
• Real-time communication similar to modern chat apps

⸻

🛡️ Security Implemented

• Password hashing using bcrypt
• JWT-based authentication
• Protected API routes
• Server-side validation
• Secure authentication flow

⸻

📈 Future Improvements

• End-to-End Encryption
• Typing Indicators
• Read Receipts
• Group Chat & Chat Rooms
• Media/File Sharing
• Push Notifications
• Emoji & GIF Support
• Online/Offline Status
• Dark Mode
• Docker Deployment
• Mobile App Version

⸻

🤝 Contribution

• Fork the repository
• Create your feature branch
• Commit your changes
• Open a pull request

Contributions are welcome.

⸻

