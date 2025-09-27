"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema_1 = require("../validators/orderSchema");
const customerModel_1 = __importDefault(require("../models/customerModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const socket_1 = require("../utils/socket");
const AppError_1 = require("../utils/AppError");
const catchAsync_1 = require("../utils/catchAsync");
const getCustomer = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const customerId = req.params.id;
    const customer = await customerModel_1.default.findById(customerId).populate({
        path: "orders",
        select: "product_name quantity product_image status createdAt updatedAt"
    }).populate({
        path: "admins",
        select: "name admin"
    });
    if (!customer)
        return next(new AppError_1.AppError('customer not found', 404));
    res.status(200).json({ status: 'success', customer: customer });
});
const createOrder = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const createOrderPayload = req.body;
        // ✅ Zod validation (coerce string -> number for quantity)
        const validateData = orderSchema_1.OrderSchema.safeParse(createOrderPayload);
        if (!validateData.success) {
            await session.abortTransaction();
            session.endSession();
            const errors = validateData.error.issues.map(issue => ({
                field: issue.path.join("."), // will show "mimetype" or "size"
                message: issue.message,
            }));
            return next(new AppError_1.AppError('Validation failed...!!!', 411, errors));
        }
        const { name, email, contact_number, shipping_address, product_name, quantity, } = validateData.data;
        //validate file
        const productImageFile = orderSchema_1.fileMetaSchema.safeParse({ mimetype: req.file?.mimetype, size: req.file?.size, });
        // ✅ Check file exists
        if (!productImageFile.success) {
            await session.abortTransaction();
            session.endSession();
            const errors = productImageFile.error.issues.map(issue => ({
                field: issue.path.join("."), // will show "mimetype" or "size"
                message: issue.message,
            }));
            return next(new AppError_1.AppError('File validation failed...!!!', 411, errors));
        }
        // ✅ Upload to Cloudinary using file buffer
        const result = productImageFile ? await new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.uploader.upload_stream({ folder: "customer-orders", resource_type: "image" }, (error, result) => {
                if (error)
                    return reject(error);
                else
                    resolve(result);
            });
            stream.end(req.file.buffer); // send buffer directly
        }) : null;
        // ✅ Find or create customer in transaction
        let customer = await customerModel_1.default.findOne({ email }).session(session);
        if (!customer) {
            const newCustomer = await customerModel_1.default.create([
                {
                    name,
                    email,
                    contact_number,
                    shipping_address,
                },
            ], { session });
            customer = newCustomer[0];
        }
        // ✅ Create order in transaction
        const order = await orderModel_1.default.create([
            {
                customer_id: customer._id,
                product_name,
                quantity,
                product_image: result.secure_url,
                status: "pending",
            },
        ], { session });
        // ✅ Push order ID to customer's orders array
        customer.orders.push(order[0]._id);
        await customer.save({ session });
        // ✅ Commit transaction
        await session.commitTransaction();
        session.endSession();
        //emit event with order + customer details
        socket_1.io.emit("newOrder", {
            order: order[0],
            customer: {
                name: customer.name,
                email: customer.email,
                contact_number: customer.contact_number,
                shipping_address: customer.shipping_address
            }
        });
        return res.status(201).json({
            message: "Order placed successfully...!!!",
            customer,
            order: order[0],
        });
    }
    finally {
        // ✅ Safely abort if still active (no double abort issue)
        if (session.inTransaction()) {
            await session.abortTransaction();
            session.endSession();
        }
    }
});
exports.default = { createOrder, getCustomer };
