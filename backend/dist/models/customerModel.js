"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const customerSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    admin_id: {
        type: String,
        ref: "Admin",
        required: false
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'A customer provide email id']
    },
    contact_number: {
        type: String,
        unique: true,
        required: [true, "A customer must provide contact number"]
    },
    shipping_address: {
        type: String,
        required: [true, 'A customer provided Shipping address'],
    },
    avatar: {
        type: String,
    },
    orders: [{ type: String, ref: "Order" }],
    admins: [{ type: String, ref: "Admin" }]
}, { timestamps: true });
const Customer = mongoose_1.default.model('Customer', customerSchema);
exports.default = Customer;
