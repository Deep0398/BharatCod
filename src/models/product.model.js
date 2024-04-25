import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        
    },
    price:{
        type:String,
        required:true
    },
    specification:{
        type:String,
        
    },
    category:{
        type:String,
        enum:['mobiles', 'electronics', 'accessories','clothing','beauty'],
       
    },
    productimage1:{
        type:String,    
    },
    productimage2:{
        type:String,
    },
    productimage3:{
        type:String,
    },
    productimage4:{
        type:String,
    },
    color:{
        type:String,   
    },
    size:{
        type:String,
    },
    rating:{
        type:Number,
        default:0
    },
    reviews:{
        type: String,
    },
    stock:{
        type:Number,
        default:0
    },
    sold:{
        type:Number,
        default:0
    },
    brand:{
        type:String,
    }


});
export const Products = mongoose.model('Products', productSchema);