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
Route	Method	Description
/api/auth/register	POST	Register new user
/api/auth/login	POST	Login user
/api/auth/logout	POST	Logout user
/api/auth/send-verify-otp	POST	Send email verification OTP
/api/auth/verify-account	POST	Verify user email using OTP
/api/auth/is-auth	GET	Check if user is authenticated
/api/auth/send-reset-otp	POST	Send reset OTP to email
/api/auth/reset-password	POST	Reset password using OTP

User
Route	Method	Description
/api/user/data	GET	Get authenticated user's data

## 🧠 Learning Outcomes
Full-stack authentication using JWT and cookies

Building secure REST APIs with Express

Working with protected routes and middleware

Managing global app state using React Context API


## ✨ Credits
Built using React, Node.js, Express, MongoDB

OTP via Nodemailer

Auth with JWT
