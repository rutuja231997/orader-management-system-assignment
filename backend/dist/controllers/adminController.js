"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const socket_1 = require("../utils/socket");
const adminModel_1 = __importDefault(require("../models/adminModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const authSchema_1 = require("../validators/authSchema");
const orderSchema_1 = require("../validators/orderSchema");
const AppError_1 = require("../utils/AppError");
const catchAsync_1 = require("../utils/catchAsync");
const mongoose_1 = __importDefault(require("mongoose"));
const customerModel_1 = __importDefault(require("../models/customerModel"));
const signUp = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const createAuthPayload = req.body;
    const validateData = authSchema_1.signUpInput.safeParse(createAuthPayload);
    if (!validateData.success) {
        const errors = validateData.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message
        }));
        return next(new AppError_1.AppError('Inputs are wrong...!!!', 411, errors));
    }
    //hash password
    const saltRound = 10;
    const hashedPassword = await bcrypt_1.default.hash(createAuthPayload.password, saltRound);
    const newAdmin = await adminModel_1.default.create({
        name: createAuthPayload.name,
        email: createAuthPayload.email,
        password: hashedPassword,
        createdAt: new Date(),
    });
    //generate jwt token
    const key = process.env.JWT_SECRET;
    const token = jsonwebtoken_1.default.sign({ adminId: newAdmin._id, email: newAdmin.email }, key, {
        expiresIn: "2d"
    });
    //store token in cookies
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 2 * 24 * 60 * 60 * 1000, //expires cookies in 2 mins
    });
    return res.status(200).json({
        message: "admin sign up successfully...!!!",
        admin: newAdmin,
        token: token
    });
});
const signIn = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const checkPayload = req.body;
    const parsePayload = authSchema_1.signInInput.safeParse(checkPayload);
    if (!parsePayload.success) {
        const errors = parsePayload.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message
        }));
        return next(new AppError_1.AppError('Inputs are wrong...!!!', 411, errors));
    }
    const existingAdmin = await adminModel_1.default.findOne({ email: checkPayload.email,
    }).select("+password");
    if (!existingAdmin) {
        return res.status(404).json({ message: 'user not found..!!!' });
    }
    //compare password with hash password
    const isMatchPassword = await bcrypt_1.default.compare(checkPayload.password, existingAdmin.password);
    if (!isMatchPassword) {
        return res.status(401).json({ message: 'Invalid password...!!!' });
    }
    const token = jsonwebtoken_1.default.sign({ adminId: existingAdmin._id, email: existingAdmin.email }, process.env.JWT_SECRET, { expiresIn: "2d" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
        message: "sign-in successfully...!!!",
        id: existingAdmin._id,
        token: token,
        admin: existingAdmin
    });
});
const allOrders = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminPayload = req.admin;
    const adminId = adminPayload?.adminId;
    const admin = await adminModel_1.default.findById(adminId);
    if (!admin) {
        return next(new AppError_1.AppError('Inputs are wrong...!!!', 411));
    }
    const { date, product_name } = req.query;
    const filter = {}; // fetch all orders (handled + unhandled)
    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        filter.createdAt = { $gte: start, $lt: end };
    }
    if (product_name) {
        filter.product_name = { $regex: product_name, $options: "i" };
    }
    const orders = await orderModel_1.default.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({
        message: orders.length > 0 ? "Orders fetched successfully" : "No orders found",
        orders
    });
});
const filterOrders = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminPayload = req.admin;
    const adminId = adminPayload?.adminId;
    const admin = await adminModel_1.default.findById(adminId);
    if (!admin) {
        return next(new AppError_1.AppError('Inputs are wrong...!!!', 411));
    }
    const { date, product_name } = req.query;
    const filter = {}; // fetch all orders (handled + unhandled)
    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        filter.createdAt = { $gte: start, $lt: end };
    }
    if (product_name) {
        filter.product_name = { $regex: product_name, $options: "i" };
    }
    const orders = await orderModel_1.default.find(filter)
        .populate("customer_id", "name email contact_number") // ✅ fetch customer details
        .populate("admin_id", "name email") // optional: fetch admin details
        .sort({ createdAt: -1 });
    return res.status(200).json({
        message: orders.length > 0 ? "Orders fetched successfully" : "No orders found",
        orders
    });
});
const editOrder = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const adminPayload = req.admin;
        const adminId = adminPayload.adminId;
        const id = req.params.id;
        const orderPayload = req.body;
        const admin = await adminModel_1.default.findById(adminId);
        if (!admin) {
            return next(new AppError_1.AppError('admin not found...!!!', 404));
        }
        //validate order payload by zod validation
        const validateData = orderSchema_1.OrderSchema.safeParse(orderPayload);
        if (!validateData.success) {
            const errors = validateData.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message
            }));
            return next(new AppError_1.AppError('Inputs are wrong...!!!', 411, errors));
        }
        const { product_name, quantity, status } = validateData.data;
        //update order quantity and product_name
        const updatedOrder = await orderModel_1.default.findByIdAndUpdate({ _id: id }, {
            admin_id: adminId,
            product_name: product_name,
            quantity: quantity,
            status: status,
            updatedAt: new Date()
        }, { new: true }).populate("customer_id");
        //find customer id
        const customer = await customerModel_1.default.findById(updatedOrder?.customer_id).session(session);
        if (!customer) {
            return next(new AppError_1.AppError('customer not found...!!!', 404));
        }
        //add admin to customer's admin array if not already present
        if (!customer.admins.includes(adminId)) {
            customer.admins.push(adminId);
            await customer.save({ session });
        }
        if (!updatedOrder) {
            return next(new AppError_1.AppError("order details are not found or already deleted", 404));
        }
        await session.commitTransaction();
        session.endSession();
        //emit real-time event to all admins
        socket_1.io.emit("orderUpdated", updatedOrder);
        //build dynamic message
        let updatedFields = [];
        if (product_name)
            updatedFields.push(`name:${product_name}`);
        if (quantity)
            updatedFields.push(`quantity: ${quantity}`);
        const message = `Product ${updatedFields.join(" & ")} updated successfully...!!!`;
        return res.status(200).json({
            message: message,
            updatedOrder: updatedOrder,
            customer: customer
        });
    }
    finally {
        if (session.inTransaction()) {
            await session.abortTransaction();
            session.endSession();
        }
    }
});
const deleteOrder = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const id = req.params.id;
    const adminPayload = req.admin;
    const adminId = adminPayload.adminId;
    const admin = await adminModel_1.default.findById(adminId);
    if (!admin) {
        return next(new AppError_1.AppError('admin not found...!!!', 404));
    }
    const existingOrder = await orderModel_1.default.findByIdAndDelete({ _id: id });
    socket_1.io.emit("orderDeleted", existingOrder);
    return res.status(200).json({
        message: "order is deleted...!!!",
        order: existingOrder
    });
});
const getAdmin = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminId = req.params.id;
    const admin = await adminModel_1.default.findById(adminId).populate({
        path: "orders",
        select: "product_name quantity product_image status createdAt updatedAt"
    }).populate({
        path: "customers",
        select: "name email contact_number shipping_address"
    });
    if (!admin)
        return next(new AppError_1.AppError('admin not found', 404));
    res.status(200).json({ status: 'success', admin: admin });
});
const logOut = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminPayload = req.admin;
    const adminId = adminPayload.adminId;
    const admin = await adminModel_1.default.findById(adminId);
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });
    return res.status(200).json({
        admin: admin,
        message: "Logout successfully...!!!"
    });
});
exports.default = { signUp, signIn, allOrders, filterOrders, editOrder, deleteOrder, getAdmin, logOut };
