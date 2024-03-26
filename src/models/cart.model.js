import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({

    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    
    },
    totalPrice:{
        type: Number,
        required: true
    }
})

const CartItem = mongoose.model('CartItem',cartItemSchema)
export default CartItem;