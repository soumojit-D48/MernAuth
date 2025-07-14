import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`\nMongoDB connected!! 
    DB HOST   : ${connect.connection.host}
    DB NAME   : ${connect.connection.name}
    `);

    } catch (err) {
        console.log("MongoDB connection Failed" , err);
        process.exit(1)
    }
}

export default connectDB;