import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    specification:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:['mobiles', 'electronics', 'accessories'],
        required:true
    },
    image:{
        type:String
    }
});
export const Products = mongoose.model('Products', productSchema);