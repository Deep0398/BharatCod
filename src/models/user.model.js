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
            required: false
        },
    })
        const userSchema = new mongoose.Schema({

        name:{
            type: String,
            required: true
        },
    
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
            
        },
    

        role:{
        type:String,
        enum:['admin','vendor','user'],
        default:'user',
        required:false
        },
        image:{
            type:String,
            required:false
    },
    addresses:[addressSchema]
    
    }, {timestamps:true} 

    )


    export const userModel =  mongoose.model('users',userSchema);