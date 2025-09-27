import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        if (!process.env.DATABASE_CONNECTION_STRING || !process.env.DATABASE_PASSWORD) {
            throw new Error("Database environment variables are missing!");
        }

        const db_connection = process.env.DATABASE_CONNECTION_STRING!.replace(
        "<db_password>", process.env.DATABASE_PASSWORD!
)
        await mongoose.connect(db_connection);
        console.log('mongodb connected using mongoose');

    }catch(e){
        console.log('mongodb connection error:', e);
        process.exit(1)
    }
};

export default connectDB;

