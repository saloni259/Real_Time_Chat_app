# 💬 Real-Time Chat Application

A robust, full-stack Real-Time Chat Application built using the **MERN stack** and **Socket.io**. This project demonstrates end-to-end development, featuring secure authentication, real-time bi-directional communication, and a responsive user interface.

---

## 🚀 Key Features

### 🔐 Authentication System
* **Secure Onboarding:** User Registration and Login.
* **Account Recovery:** Fully functional "Forgot Password" and "Password Reset" flow.
* **Security First:** Password hashing using `bcrypt` and session management via `JWT` (JSON Web Tokens).
* **Protected Routes:** Frontend and Backend guards to ensure only authenticated users access the chat.

### 💬 Real-Time Messaging
* **Instant Delivery:** Powered by `Socket.io` for low-latency, bi-directional communication.
* **Live Updates:** Exchange messages instantly without page refreshes.
* **Connection Handling:** Real-time tracking of active socket connections.

### 👤 Profile Management
* **Personalization:** Update usernames, email addresses, and bios.
* **Avatar Uploads:** Support for uploading and updating profile pictures.
* **User Discovery:** View profile details within the chat ecosystem.

### 🎨 User Interface
* **Modern Design:** Clean, intuitive, and responsive layout.
* **Dynamic Sidebar:** Easily toggle between different conversations and users.
* **Seamless UX:** Smooth transitions and organized chat threads.

---

## 🧠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js, Axios, Socket.io-client, CSS3/Tailwind |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT, bcrypt |

---

## 📁 Project Structure

``text
chat_final/
├── backend/          # Express server, API routes, Models, & Controllers
├── frontend/         # React application, Components, & State management
├── .gitignore        # Files to exclude from Git
├── package.json      # Root dependencies
└── README.md         # Documentation
📁 Project Structure

chat_final/
• backend/ – Express server & APIs
• frontend/ – React application
• package.json
• README.md

⸻

⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/saloni259/Real_Time_Chat_app.git
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


