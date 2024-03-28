import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();



export  default async function connectDB(){
    try {
        const connect = await mongoose.connect(process.env.mongoURL);
        console.log('db connected'+connect.connection.host);
    } catch (err) {
    res.status(500).send(err.message);
    }
    
}