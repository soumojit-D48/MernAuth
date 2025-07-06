import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import transporter from '../config/nodeMailer.js'


const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' })
    }

    try {
        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({ name, email, password: hashedPassword })
        await user.save()

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // false for dev env and true for prod env
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        // Sending welcome email // Define the mail options
        const mailOptions = { // obj
            from: process.env.SENDER_EMAIL,
            to: email, // it came from req.body
            subject: "Hello from Nodemailer!",
            text: `This is a test email sent from Node.js using Nodemailer Your email id: ${email}`
        }

        await transporter.sendMail(mailOptions)

        return res.json({ success: true })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.json({ success: false, message: 'Email and password are required' })
    }

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'Invalid Email' })
        }

        const matchPassword = await bcrypt.compare(password, user.password) // true or false

        if (!matchPassword) {
            return res.json({ success: false, message: 'Invalid Password' })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        )

        res.cookie('token', token, { // 'name', value
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

// const sendVerifyOtp = async (req, res) => { // send varification OTP to the User's Email
//     try {
//         const { userId } = req.body

//         const user = await userModel.findById(userId)

//         if (user.isAccountVerified) { // user is already verified so no need to send the otp
//             return res.json({ success: false, message: "Account already verified" })
//         }
//         // if user is not verified then send the otp
//         const otp = String(Math.floor(100000 + Math.random() * 900000)) // 6 digit num

//         // save the otp in db for perticuler user 
//         user.verifyOtp = otp
//         user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hr from now

//         await user.save() // save all

//         // send the otp to the user's mail

//         const mailOptions = {
//             from: process.env.SENDER_EMAIL,
//             to: user.email,
//             subject: 'Account Verification OTP',
//             text: `Your OTP is ${otp}. Verify your account using this OTP`
//         }

//         await transporter.sendMail(mailOptions)

//         res.json({ success: true, message: 'Varification OTP sent on Email' })

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }



const sendVerifyOtp = async (req, res) => { // send verification OTP to the User's Email
    try {
        const { userId } = req.body

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.isAccountVerified) { // user is already verified so no need to send the otp
            return res.json({ success: false, message: "Account already verified" })
        }
        // if user is not verified then send the otp
        const otp = String(Math.floor(100000 + Math.random() * 900000)) // 6 digit num

        // save the otp in db for particular user 
        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hr from now

        await user.save() // save all

        // send the otp to the user's mail

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP`
        }

        await transporter.sendMail(mailOptions)

        return res.json({ success: true, message: 'Verification OTP sent on Email' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// after sent the otp, we have to varify if its correct or not

const varifyedEmail = async (req, res) => {
    const { userId, otp } = req.body

    if (!userId || !otp) {
        return res.json({ success: false, message: 'Missing Details' })
    }

    try {
        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.verifyOtp === '' || user.verifyOtp != otp) { // one store in db which already sent and another one came via frontend input field
            return res.json({ success: false, message: 'Invalid OTP' })
        }

        if (user.verifyOtpExpireAt < Date.now()) { // otp expired
            return res.json({ success: false, message: 'OTP Expired' })
        }

        // reset if all is well
        user.isAccountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0

        await user.save()
        return res.json({ success: true, message: 'Email varified successfully' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const isAuthenticated = async (req, res) => { // before this we execute the middleware if the middleware will execute then this func called
    try {
        return res.json({success: true})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// send password reset otp

const sendResetOtp = async (req, res) => {
    const { email } = req.body

    if(!email){
        return res.json({success: false, message: 'Email is Required'})
    }

    try {
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "User not found"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password reset OTP',
            text: `OTP for reseting your password is ${otp}`
        }

        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: 'OTP send to your email'})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// after sending the otp for changing the otp now have to reset the password is otp was correct
const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body

    if(!email || !otp || !newPassword){
        return res.json({success: false, message: 'Email, Otp and new Password is required'})
    }

    try {
        const user = await userModel.findOne({email})
        
        if(!user){
            return res.json({success: false, message: 'User not found'})
        }

        // empty or not matching db otp with sended otp
        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success: false, message: 'Invalid OTP'})
        }

        // whem otp was expired
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: 'OTP Expired'})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        user.resetOtp = '' // back to normal
        user.resetOtpExpireAt = 0

        await user.save()

        return res.json({success: true, message: 'Password has reset successfully'})

    } catch (error) {
        return res.json({success: false, message: error.message})
        
    }
}

export {
    register,
    login,
    logout,
    sendVerifyOtp,
    varifyedEmail,
    isAuthenticated,
    sendResetOtp,
    resetPassword
}