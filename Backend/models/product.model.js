import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Name is required"],
    },
    description:{
        type: String,
        required: true,
    },
    price : {
        type : Number,
        min : 0,
        required : true,
    },
    image : {
        type:String,
        required:true,
    },
    category:{
        type: String,
        required: true,
    },
    isFeatured:{
        type: Boolean,
        default: false,
    },
},{timestamps:true});

export default mongoose.model("Product",productSchema);