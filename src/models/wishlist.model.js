import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products',
        required:true
    }]
},{timestamps:true})

export const Wishlist = mongoose.model('Wishlist',wishlistSchema)