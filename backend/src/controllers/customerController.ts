import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";

import {fileMetaSchema, OrderSchema} from "../validators/orderSchema"

import Customer from "../models/customerModel";
import Order from "../models/orderModel";

import cloudinary from "../config/cloudinary";
import { io } from "../utils/socket";

import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

const getCustomer = catchAsync(async (req:Request, res:Response, next:NextFunction)=>{
    const customerId = req.params.id

    const customer = await Customer.findById(customerId).populate({
        path:"orders",
        select:"product_name quantity product_image status createdAt updatedAt"
    }).populate({
        path:"admins",
        select:"name admin"
    })

    if(!customer) return next(new AppError('customer not found', 404));
    res.status(200).json({status: 'success', customer: customer})
})


const createOrder = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const createOrderPayload = req.body;

    // ✅ Zod validation (coerce string -> number for quantity)
    const validateData = OrderSchema.safeParse(createOrderPayload);
    if (!validateData.success) {
      await session.abortTransaction();
      session.endSession();

      const errors = validateData.error.issues.map(issue => ({
        field: issue.path.join("."), // will show "mimetype" or "size"
        message: issue.message,
    }));

      return next(new AppError('Validation failed...!!!', 411, errors));
    }

    const {
      name,
      email,
      contact_number,
      shipping_address,
      product_name,
      quantity,
    } = validateData.data;

    
    //validate file
    const productImageFile = fileMetaSchema.safeParse({mimetype: req.file?.mimetype, size: req.file?.size,});
    
    // ✅ Check file exists
    if (!productImageFile.success) {
      await session.abortTransaction();
      session.endSession();

    const errors = productImageFile.error.issues.map(issue => ({
        field: issue.path.join("."), // will show "mimetype" or "size"
        message: issue.message,
    }));
      
    return next(new AppError('File validation failed...!!!', 411, errors));
    }

    // ✅ Upload to Cloudinary using file buffer
    const result = productImageFile ? await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "customer-orders", resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file!.buffer); // send buffer directly
    }) : null;

    // ✅ Find or create customer in transaction
    let customer = await Customer.findOne({ email }).session(session);

    if (!customer) {
      const newCustomer = await Customer.create(
        [
          {
            name,
            email,
            contact_number,
            shipping_address,
          },
        ],
        { session }
      );
      customer = newCustomer[0];
    }

    // ✅ Create order in transaction
    const order = await Order.create(
      [
        {
          customer_id: customer._id,
          product_name,
          quantity,
          product_image: result.secure_url,
          status: "pending",
        },
      ],
      { session }
    );

    // ✅ Push order ID to customer's orders array
    customer.orders.push(order[0]._id);
    await customer.save({ session });

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    //emit event with order + customer details
    io.emit("newOrder", {
      order: order[0],
      customer: {
        name: customer.name,
        email: customer.email,
        contact_number:customer.contact_number,
        shipping_address:customer.shipping_address
      }
    })

    return res.status(201).json({
      message: "Order placed successfully...!!!",
      customer,
      order: order[0],
    });
  } finally{
    // ✅ Safely abort if still active (no double abort issue)
    if (session.inTransaction()) {
      await session.abortTransaction();
      session.endSession();
    }
  }
})

export default {createOrder, getCustomer};

