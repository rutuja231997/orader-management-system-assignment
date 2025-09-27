import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const orderSchema = new mongoose.Schema({
    _id:{
        type:String,
        default: uuidv4
    },
    customer_id:{
        type:String,
        ref: "Customer",
        required:true
    },
    admin_id:{
        type:String,
        ref:"Admin",
        required:false,
    },
    product_name:{
        type:String,
        required: true,
    },
    quantity:{
        type:Number,
        required:true
    },
    product_image:{
        type:String,
        required: true,
    },
    status:{
        type:String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default:"pending",
        required:true
    },
}, {timestamps: true});

const Order = mongoose.model("Order", orderSchema);
export default Order;