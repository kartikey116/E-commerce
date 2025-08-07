import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectDB;