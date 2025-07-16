import express from "express"
import cors from "cors"
import "dotenv/config"
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js"
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js"

const app = express()
const port = process.env.PORT || 4000
connectDB()

const allowedOrigins = [
  'http://localhost:5173', // for local development
  'https://mernauth-frontend-bkwh.onrender.com' // deployed frontend on Render
];

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: allowedOrigins,credentials: true}))
// app.use(cors({
//   origin: 'http://localhost:5173', // or your frontend domain on vercel
//   credentials: true
// }))

// API Endpointes
app.get('/', (req, res) => res.send("Api working fine"))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port, () => console.log(`server started on port: ${port}`))

