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
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false
    },
    totalPrice:{
        type: Number,
        required: true
    }
})

const CartItem = mongoose.model('CartItem',cartItemSchema)
export default CartItem;