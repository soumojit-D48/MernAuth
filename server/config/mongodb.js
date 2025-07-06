// import mongoose from "mongoose";

// const connectDB = async () => {
//     mongoose.connection.on('connected', () => console.log("Database Connected!"))
//     await mongoose.connect(`${process.env.MONGODB_URI}/AuthMern`)
// }

// export default connectDB

// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI)
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;


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