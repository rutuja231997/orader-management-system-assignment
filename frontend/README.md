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
