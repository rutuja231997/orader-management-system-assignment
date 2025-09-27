import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const adminSchema = new mongoose.Schema(
    {
        _id:{
            type:String,
            default: uuidv4
        },
        name:{
            type:String,
            required: [true, 'A admin must fill name']
        },
        email:{
            type:String,
            required:[true, 'A admin must provide email id'],
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        avatar:{
            type:String,
        },
        orders: [{type:String, ref:"Order"}],
        customers: [{type:String, ref:"Customer"}],
    },{timestamps:true}
)

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;