"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const adminSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    name: {
        type: String,
        required: [true, 'A admin must fill name']
    },
    email: {
        type: String,
        required: [true, 'A admin must provide email id'],
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    orders: [{ type: String, ref: "Order" }],
    customers: [{ type: String, ref: "Customer" }],
}, { timestamps: true });
const Admin = mongoose_1.default.model("Admin", adminSchema);
exports.default = Admin;
