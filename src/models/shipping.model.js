import mongoose from "mongoose";

const ShippingSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    otheraddress:{
        type:String,
        required:false
    },
    orederNote:{
        type:String,
        required:false
    },
    type:{
        type: String,
        enum:['Default','Home','Work']
    }
}, { timestamps: true });

        export const Shipping = mongoose.model("Shipping", ShippingSchema);