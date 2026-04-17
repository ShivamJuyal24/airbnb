import mongoose from "mongoose";

// connect to DB
export const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database");
    }catch(error){
        console.log("Error connecting DB", error.message);
        process.exit(1);
    }
}