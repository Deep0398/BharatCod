import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    shippingAddress: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Address', 
        required: true
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
            }
    }
],
totalPrice:{
    type:Number,
   
},
status:{
    type:String,
    enum:['placed','shipped','delivered','canceled'],
    default:'placed'
},

},
{timestamps:true})

const Order = mongoose.model('Order', orderSchema)
export default Order
