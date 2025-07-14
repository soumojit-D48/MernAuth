import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import transporter from '../config/nodeMailer.js'
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js'


const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    try {
        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" })
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
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7d in milisec
        })

        // Sending welcome email // Define the mail options
        const mailOptions = { // obj
            from: process.env.SENDER_EMAIL,
            to: email, // it came from req.body
            subject: "Welcome to our App!",
            text: `Hi ${name},\n\nWelcome to our platform. Your email is successfully registered.\n\nRegards,\nTeam`
        }

        await transporter.sendMail(mailOptions)

        return res.status(201).json({ success: true, message: "Registration successful" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid Email' })
        }

        const matchPassword = await bcrypt.compare(password, user.password) // true or false

        if (!matchPassword) {
            return res.status(401).json({ success: false, message: 'Invalid Password' })
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

        return res.status(200).json({ success: true })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        return res.status().json({ success: true, message: "Logged Out" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })

    }
}



const sendVerifyOtp = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            html: EMAIL_VERIFY_TEMPLATE
                .replace("{{otp}}", otp)
                .replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'Verification OTP sent to your Email' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const varifyedEmail = async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
        return res.status(400).json({ success: false, message: 'OTP is required' });
    }

    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({ success: true, message: 'Email verified successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


const isAuthenticated = async (req, res) => { // before this we execute the middleware if the middleware will execute then this func called
    try {
        return res.status(200).json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


// send password reset otp

const sendResetOtp = async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is Required' })
    }

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password reset OTP',
            // text: `OTP for reseting your password is ${otp}`
            html: PASSWORD_RESET_TEMPLATE
                .replace("{{otp}}", otp)
                .replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOptions)

        return res.status(200).json({ success: true, message: 'OTP send to your email' })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// after sending the otp for changing the otp now have to reset the password is otp was correct
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, Otp and new Password is required' })
    }

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        // empty or not matching db otp with sended otp
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' })
        }

        // whem otp was expired
        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP Expired' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        user.resetOtp = '' // back to normal
        user.resetOtpExpireAt = 0

        await user.save()

        return res.status(200).json({ success: true, message: 'Password has reset successfully' })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })

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
