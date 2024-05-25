import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    name:{
        type: String
       
    },
   
    items:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity:{
            type:Number,
            required: true
        },
        totalPrice:{
            type:Number,
            },
            orderAddress:{
                type: String
            },
            title:{
                type: String

            }
    }
],
totalPrice:{
    type:Number,
   
},
status:{
    type:String,
    enum:['placed','processing','delivered','canceled','shipped'],
    default:'placed'
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

},
{timestamps:true})

const Order = mongoose.model('Order', orderSchema)
export default Order
