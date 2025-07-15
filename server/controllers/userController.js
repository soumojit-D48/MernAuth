import userModel from "../models/userModel.js";

const getUserData = async (req, res) => {
    try {
        const user = req.user; 

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        console.error("Error in getUserData:", error);
        res.status(500).json({ success: false, message: error.message }); 
    }
}

export { getUserData };
