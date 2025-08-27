HealthyMe 🏥

HealthyMe is a web platform designed to streamline patient management and connect patients with healthcare providers efficiently. It focuses on simplicity, accessibility, and ease of use for both patients and medical staff.

Current Features ✨

User Registration & Login – Secure authentication for patients, doctors, and admins.

Role-based Dashboard – Displays relevant information based on user role.

Patient Management – Track registered patients, appointments, and medical history.

Statistics Section – Visual metrics for key data such as patients, doctors, and appointments.

Responsive Design – Optimized for desktop, tablet, and mobile devices.

Secure & Modern – Built with current web technologies for efficiency and safety.

Tech Stack 🛠️

Frontend: React.js, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB (Local Instance)
Authentication: JWT


Installation & Setup ⚡

Step 1:
Clone the repository
git clone https://github.com/JustaDoraemonfan/Health-Project-Official.git

Step 2:
cd health-project-final

Step 1:
Install dependencies
npm install # Root folder
cd server
npm install # Backend
cd ../client
npm install # Frontend

Step 3:
Setup environment variables

Backend (/server)

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

NODE_ENV=development

CLIENT_URL=http://localhost:5173

Frontend (/client)

VITE_API_URL=http://localhost:5000

Step 4:

Run the project

Option 1 – Separate terminals:

Backend

npm run server

Frontend

cd client

npm run dev

Option 2 – Single command (root folder)

Add this to package.json in the root folder:

"scripts": {

"dev": "concurrently "npm run dev --prefix client" "npm run server --prefix server"",

"client": "npm run dev --prefix client",

"server": "npm run server --prefix server"

}

Then run:

npm run dev
