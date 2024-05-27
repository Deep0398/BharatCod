    import mongoose from "mongoose";

    const addressSchema = new mongoose.Schema({


        location: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        state: {
            type: String,
            required: false
        },
        country: {
            type: String,
            required: false
        },
        zip: {
            type: String,
            required: false
        },
        phone: {
            type: String,
            required: true
        },
        type:{
            type:String
        }
    })

    const orderItemSchema = new mongoose.Schema({
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number
        },
        orderAddress: {
            type: String
        },
        title: {
            type: String
        }
    });
    
    const embeddedOrderSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        name: {
            type: String
        },
        items: [orderItemSchema],
        totalPrice: {
            type: Number
        },
        status: {
            type: String,
            enum: ['placed', 'processing', 'delivered', 'canceled', 'shipped'],
            default: 'placed'
        }
    }, { timestamps: true });
    
    const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: false
        },
        referenceId: {
            type: String
        },
        phoneNo: {
            type: Number,
         
        },
        role: {
            type: String,
            enum: ['admin', 'vendor', 'user'],
            default: 'user',
            required: false
        },
        image: {
            type: String,
            required: false
        },
        
        addresses: [addressSchema],
        orders: [embeddedOrderSchema], // Embed full order schema
        loginMethods: {
            type: [String],
            enum: ['PhoneNo', 'Gmail', 'FaceBook']
        },
    
    recentlyViewed: [{
         type: mongoose.Schema.Types.ObjectId,
          ref: 'Products' }
        ]

    }, { timestamps: true });
    
    export const userModel = mongoose.model('users', userSchema)
