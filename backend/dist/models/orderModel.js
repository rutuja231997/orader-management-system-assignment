"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const orderSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    customer_id: {
        type: String,
        ref: "Customer",
        required: true
    },
    admin_id: {
        type: String,
        ref: "Admin",
        required: false,
    },
    product_name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    product_image: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: "pending",
        required: true
    },
}, { timestamps: true });
const Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
