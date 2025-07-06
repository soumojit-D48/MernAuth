import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

// from the cookie find the token and from that token it will find the userId

const userAuth = async (req, res, next) => {
    const {token} = req.cookies

    if(!token){
        return res.json({success: false, message: 'Not Authorized. Login Again'})
    }

    try {
        const DecodedToken =  jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(DecodedToken?._id).select("-password") // in model we use _id // exclude -ve
    
        if(!user){
            // discuss about frontend
            // throw new ApiError(401,"Invalid access Token")
            res.json({success: false, message: 'user not found'})
        }
    
        req.user = user
        next() 

        // if(DecodedToken.id){
        //     req.body.userId = DecodedToken.id
        // } else{
        //     return res.json({success: false, message: 'Not Authorized login again'})
        // }
        
        // next()
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export default userAuth

// import jwt from 'jsonwebtoken'

// const userAuth = async (req, res, next) => {
//     const { token } = req.cookies

//     if (!token) {
//         return res.json({ success: false, message: 'Not authorized. Please log in.' })
//     }

//     try {
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET) 

//         if (decodedToken?.id) {
//             // req.user = { id: decodedToken.id }
//             req.body.userId = decodedToken.id
//             next()
//         } else {
//             return res.json({ success: false, message: 'Invalid token. Please log in again.' })
//         }
//     } catch (error) {
//         // console.error('Auth Error:', error.message)
//         return res.json({ success: false, message: 'Token verification failed. Please log in again.' })
//     }
// }

// export default userAuth
