# MERN Auth System 🔐

## 🚀 Live Demo

🔗 [View it on Render](https://mernauth-frontend-bkwh.onrender.com)

A complete full-stack **MERN (MongoDB, Express, React, Node.js)** authentication system with:

- ✅ User registration & login
- ✅ JWT authentication via HTTP-only cookies
- ✅ Email verification using OTP
- ✅ Password reset via OTP
- ✅ Protected routes using middleware
- ✅ Nodemailer integration

---

## 🔧 Tech Stack

### 📦 Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- Bcrypt
- Nodemailer
- dotenv

### 🎨 Frontend
- React (Vite)
- Axios
- React Router DOM
- Tailwind CSS
- React Toastify

---

## 🗂️ Folder Structure

```bash
.
├── client               # React Frontend (Vite)
│   ├── public
│   └── src
│       ├── assets       # Images/icons
│       ├── components   # Reusable UI components (Navbar, Header)
│       ├── context      # AppContext for global state
│       └── pages        # Route pages (Login, Register, Verify, Reset)
├── server               # Node.js Backend
│   ├── config           # MongoDB config
│   ├── controllers      # Route controller logic
│   ├── middlewares      # JWT middleware (userAuth)
│   ├── models           # Mongoose models
│   └── routes           # Express routers
```

## 🧪 Features
1. 🔐 Registration & Login
Secure password hashing with bcrypt

JWT token stored in HTTP-only cookies

Persistent login on refresh

2. 📧 Email Verification
After register, user receives 6-digit OTP

User must verify their account

OTP expires after 24 hours

3. 🔁 Password Reset
User enters email to get OTP

OTP expires in 15 mins

After verifying OTP, user can reset password

4. 🛡️ Protected Routes
Custom middleware (userAuth) to protect routes using token in cookies

## 🔄 API Routes

Auth
POST   /api/auth/register           → Register a new user
POST   /api/auth/login              → Login existing user
POST   /api/auth/logout             → Logout the current user
POST   /api/auth/send-verify-otp    → Send email verification OTP
POST   /api/auth/verify-account     → Verify user email using OTP
GET    /api/auth/is-auth            → Check if user is authenticated
POST   /api/auth/send-reset-otp     → Send password reset OTP to email
POST   /api/auth/reset-password     → Reset password using OTP


User
GET    /api/user/data               → Fetch authenticated user's data


## 🧠 Learning Outcomes
Full-stack authentication using JWT and cookies

Building secure REST APIs with Express

Working with protected routes and middleware

Managing global app state using React Context API


## ✨ Credits
Built using React, Node.js, Express, MongoDB

OTP via Nodemailer

Auth with JWT
