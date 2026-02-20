# CYBERQUIZ - Production Ready Quiz Platform

A modern, scalable quiz platform built with Next.js 14, Prisma, and MongoDB Atlas. Featuring a futuristic dark theme and smooth performance.

## 🚀 Tech Stack
- **Frontend/Backend**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js (Credentials Provider)
- **Database**: MongoDB Atlas via Prisma ORM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion & Lenis (Smooth Scroll)
- **Validation**: Zod & Bcrypt

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js 18+
- MongoDB Atlas account (Wait for connection string)

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="mongodb+srv://your_user:your_password@cluster.mongodb.net/quizdb"
NEXTAUTH_SECRET="generate-a-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Initialization
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

## 🔐 Security & Roles
- **User Role**: Default for all new registrations.
- **Admin Role**: Grant manually in MongoDB by setting `role: "ADMIN"` on a user document. Admins can access the dynamic quiz creation interface at `/admin/quiz/new`.
- Secure password hashing with Bcrypt...

## 🎨 UI/UX Highlights
- **Futuristic Theme**: Deep blues, blacks, and neon cyan/purple accents.
- **Glassmorphism**: Blurred backgrounds and semi-transparent borders.
- **Micro-interactions**: Hover effects, glowing buttons, and smooth transitions.
- **Responsive**: Fully optimized for mobile, tablet, and desktop.

## 📁 Project Structure
- `/app`: App router pages and API routes
- `/actions`: Server actions for auth and quiz logic
- `/components`: Reusable UI elements
- `/lib`: Utility functions and Prisma client
- `/prisma`: Database schema and seed script
- `/types`: TypeScript definitions
