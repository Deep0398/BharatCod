import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        
    },
    regularPrice:{
        type:Number,
        
    },
    salePrice:{
        type:Number,
        
    },
    price:{
        type:Number,
        
    },
    discount: { type: Number, default: 0 },
    specification:{
        type:String,
        
    },
    category:{
        type: String,
          
    },
    subcategory:{
        type:String
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

productSchema.pre('save', function(next) {
    if (this.salePrice < this.regularPrice) {
        this.discount = ((this.regularPrice - this.salePrice) / this.regularPrice) * 100;
    } else {
        this.discount = 0;
    }
    next();
});
export const Products = mongoose.model('Products', productSchema);