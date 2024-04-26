import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
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
