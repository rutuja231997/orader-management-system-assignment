# Backend – Node.js + Express + MongoDB

This is the **backend server** for the application, built with **Node.js**, **Express**, **MongoDB**, and **TypeScript**.  
It provides **admin authentication**, **order management**, and **file uploads**, with input validation using **Zod** and API communication via **Axios**.

---

## 🚀 Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **TypeScript** – Type-safe development
- **MongoDB + Mongoose** – Database and ORM
- **Zod** – Request payload validation
- **JWT (jsonwebtoken)** – Authentication
- **Bcrypt** – Password hashing
- **Multer + Cloudinary** – File uploads & cloud storage
- **Socket.io** – Real-time updates (optional)
- **Axios** – HTTP client

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/your-backend-repo.git
cd backend

2️⃣ Install dependencies
npm install

3️⃣ Setup environment variables
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/your-database
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

4️⃣ Run the server
npm run dev

5️⃣ Build & Run for production
npm run build
npm start


AND 

# Frontend – Next.js + React + TypeScript

This is the **frontend** for the application, built with **Next.js**, **React**, and **TypeScript**.  
It communicates with the backend via **Axios** and handles **state management** using **Redux Toolkit**.  
Input validation is done using **Zod**, and UI notifications are handled with **react-hot-toast**.

---

## 🚀 Tech Stack

- **Next.js (v14)** – React framework for SSR and SSG
- **React (v18)** – Frontend library
- **TypeScript** – Type-safe development
- **Redux Toolkit** – State management
- **Axios** – HTTP client
- **Zod** – Form and input validation
- **react-hot-toast** – Notifications
- **Tailwind CSS + tailwind-merge + tailwindcss-animate** – Styling and animations
- **Socket.io-client** – Real-time updates
- **Lucide-react** – Icons
- **Clsx** – Conditional classNames helper

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/your-frontend-repo.git
cd frontend


2️⃣ Install dependencies
npm install

3️⃣ Setup environment variables
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000


4️⃣ Run the development server
npm run dev


5️⃣ Build & Run for production
npm run build
npm start
