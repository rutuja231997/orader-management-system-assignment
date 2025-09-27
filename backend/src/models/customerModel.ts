import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const customerSchema = new mongoose.Schema({
    _id:{
        type:String,
        default: uuidv4
    },
    admin_id:{
        type:String,
        ref:"Admin",
        required:false
    },
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        unique:true,
        required: [true, 'A customer provide email id']
    },
    contact_number:{
        type:String,
        unique:true,
        required:[true, "A customer must provide contact number"]
    },
    shipping_address:{
        type:String,
        required:[true, 'A customer provided Shipping address'],
    },
    avatar:{
        type:String,
    },
    orders: [{type: String, ref: "Order"}],
    admins: [{type: String, ref: "Admin"}]
}, {timestamps: true}
)

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;