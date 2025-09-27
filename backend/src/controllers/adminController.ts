import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express"

import { io } from "../utils/socket";

import Admin from "../models/adminModel";
import Order from "../models/orderModel";

import {signUpInput, signInInput} from "../validators/authSchema";
import { OrderSchema } from "../validators/orderSchema";

import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import mongoose from "mongoose";
import Customer from "../models/customerModel";

const signUp = catchAsync(async (req: Request,res: Response, next:NextFunction)=>{
    const createAuthPayload = req.body;

    const validateData = signUpInput.safeParse(createAuthPayload);

    if(!validateData.success){

        const errors = validateData.error.issues.map(issue=>({
            field: issue.path.join("."),
            message: issue.message
        }))

        
        return next(new AppError('Inputs are wrong...!!!', 411, errors))
    }

    //hash password
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(createAuthPayload.password, saltRound);

    const newAdmin = await Admin.create({
        name:createAuthPayload.name,
        email:createAuthPayload.email,
        password:hashedPassword,
        createdAt: new Date(),
    });

    //generate jwt token
    const key = process.env.JWT_SECRET!;
    const token = jwt.sign({ adminId: newAdmin._id, email: newAdmin.email}, key, {
        expiresIn: "2d"
    })

    //store token in cookies
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite:"lax",
        maxAge: 2 * 24 * 60 * 60 * 1000, //expires cookies in 2 mins
    } )
    return res.status(200).json({
        message: "admin sign up successfully...!!!",
        admin: newAdmin,
        token: token
    })
})

const signIn = catchAsync(async(req: Request, res: Response, next:NextFunction)=>{
    const checkPayload = req.body;

    const parsePayload = signInInput.safeParse(checkPayload);

    if(!parsePayload.success){
        
        const errors = parsePayload.error.issues.map(issue=>({
            field: issue.path.join("."),
            message: issue.message
        }))

        
        return next(new AppError('Inputs are wrong...!!!', 411, errors))
    }

      const existingAdmin = await Admin.findOne({email: checkPayload.email,
        }).select("+password");

        if(!existingAdmin){
            return res.status(404).json({message: 'user not found..!!!'})
        }

        //compare password with hash password
        const isMatchPassword = await bcrypt.compare(checkPayload.password, existingAdmin.password);

        if(!isMatchPassword){
            return res.status(401).json({message:'Invalid password...!!!'})
        }

        const token = jwt.sign(
            {adminId: existingAdmin._id, email: existingAdmin.email},
            process.env.JWT_SECRET!,
            {expiresIn: "2d"}
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message:"sign-in successfully...!!!",
            id: existingAdmin._id,
            token: token,
            admin:existingAdmin
        })
})

const allOrders = catchAsync(async(req: Request, res:Response, next:NextFunction)=>{
    const adminPayload = req.admin as JwtPayload;
    const adminId = adminPayload?.adminId;

    const admin = await Admin.findById(adminId);

    if(!admin){        
        return next(new AppError('Inputs are wrong...!!!', 411))
    }

    const { date, product_name } = req.query;

    const filter: any = {}; // fetch all orders (handled + unhandled)

    if (date) {
      const start = new Date(date as string);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      filter.createdAt = { $gte: start, $lt: end };
    }

    if (product_name) {
      filter.product_name = { $regex: product_name as string, $options: "i" };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      message: orders.length > 0 ? "Orders fetched successfully" : "No orders found",
      orders
    });
    
}
)

const filterOrders = catchAsync( async(req: Request, res:Response, next:NextFunction)=>{
    const adminPayload = req.admin as JwtPayload;
    const adminId = adminPayload?.adminId;

    const admin = await Admin.findById(adminId);

    if(!admin){        
        return next(new AppError('Inputs are wrong...!!!', 411))
    }

    const { date, product_name } = req.query;

    const filter: any = {}; // fetch all orders (handled + unhandled)

    if (date) {
      const start = new Date(date as string);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      filter.createdAt = { $gte: start, $lt: end };
    }

    if (product_name) {
      filter.product_name = { $regex: product_name as string, $options: "i" };
    }

    const orders = await Order.find(filter)
    .populate("customer_id", "name email contact_number") // ✅ fetch customer details
    .populate("admin_id", "name email") // optional: fetch admin details
    .sort({ createdAt: -1 });

    return res.status(200).json({
      message: orders.length > 0 ? "Orders fetched successfully" : "No orders found",
      orders
    });
    
})

const editOrder = catchAsync( async(req: Request, res:Response, next:NextFunction)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const adminPayload = req.admin as JwtPayload;
        const adminId = adminPayload.adminId;

        const id = req.params.id;
        const orderPayload = req.body;

        const admin = await Admin.findById(adminId);

        if(!admin){
             return next(new AppError('admin not found...!!!', 404))
        }

        //validate order payload by zod validation
        const validateData = OrderSchema.safeParse(orderPayload);

        if(!validateData.success){
            const errors = validateData.error.issues.map(issue=>({
                field: issue.path.join("."),
                message: issue.message
            }))

            return next(new AppError('Inputs are wrong...!!!', 411, errors))
        }

        const {product_name, quantity, status} = validateData.data;

        //update order quantity and product_name
        const updatedOrder = await Order.findByIdAndUpdate(
            {_id: id},
            {
                admin_id:adminId,
                product_name: product_name,
                quantity: quantity,
                status:status,
                updatedAt: new Date()
            },
            {new: true}
        ).populate("customer_id");

        //find customer id
        const customer = await Customer.findById(updatedOrder?.customer_id).session(session);

        if(!customer){
            return next(new AppError('customer not found...!!!', 404))
        }

        //add admin to customer's admin array if not already present
        if(!customer.admins.includes(adminId)){
            customer.admins.push(adminId);
            await customer.save({session})
        }
       
        if(!updatedOrder){
            return next(new AppError("order details are not found or already deleted", 404))
        }

        await session.commitTransaction();
        session.endSession();

        //emit real-time event to all admins
        io.emit("orderUpdated", updatedOrder)

        //build dynamic message
        let updatedFields: string[] = [];

        if(product_name) updatedFields.push(`name:${product_name}`);
        if(quantity) updatedFields.push(`quantity: ${quantity}`);

        const message = `Product ${updatedFields.join(" & ")} updated successfully...!!!`;

        return res.status(200).json({
            message: message,
            updatedOrder:updatedOrder,
            customer: customer
        })
    }finally{
        if(session.inTransaction()){
            await session.abortTransaction();
            session.endSession()
        }
    }    

})

const deleteOrder = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const id = req.params.id;
    
    const adminPayload = req.admin as JwtPayload;
    const adminId = adminPayload.adminId;

    const admin = await Admin.findById(adminId);

    if(!admin){
        return next(new AppError('admin not found...!!!', 404))
    }

    const existingOrder = await Order.findByIdAndDelete({_id:id});

    io.emit("orderDeleted", existingOrder);

    return res.status(200).json({
            message:"order is deleted...!!!",
            order: existingOrder
    })
})

const getAdmin = catchAsync(async (req:Request, res:Response, next:NextFunction)=>{
    const adminId = req.params.id

    const admin = await Admin.findById(adminId).populate({
        path:"orders",
        select:"product_name quantity product_image status createdAt updatedAt"
    }).populate({
        path:"customers",
        select:"name email contact_number shipping_address"
    })

    if(!admin) return next(new AppError('admin not found', 404));
    res.status(200).json({status: 'success', admin: admin})
})

const logOut = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const adminPayload = req.admin as JwtPayload;
    const adminId = adminPayload.adminId;

    const admin = await Admin.findById(adminId);

    res.clearCookie("token", {
        httpOnly:true,
        secure:true,
        sameSite:"strict"
    })

    return res.status(200).json({
        admin: admin,
        message: "Logout successfully...!!!"
    })

})

export default {signUp, signIn, allOrders, filterOrders, editOrder, deleteOrder, getAdmin, logOut}