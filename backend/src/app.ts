import dotenv from "dotenv";
dotenv.config({path: "./config.env"});

import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

import adminRouter from "./routes/AdminRouter";
import customerRouter from "./routes/customerRouter";
import { AppError } from "./utils/AppError";
import { globalErrorHandler } from "./middlewares/errorMiddleware";

const app = express();

const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3000";

app.use(express.json());
app.use(cors({
    origin: allowedOrigins,
    credentials:true
}));
app.use(cookieParser())

//routers
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/customer", customerRouter);

//handle unknown routes (404)
app.use((req,res,next)=>{
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404))
})

//Global error handle Last
app.use(globalErrorHandler)

export default app;

