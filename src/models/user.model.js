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
        type:{
            type:String
        }
    })
        const userSchema = new mongoose.Schema({

        name:{
            type: String,
            required: false
        },
    
        email:{
            type:String,
            required:false,
            
        },
        password:{
            type:String,
            required:false
            
        },
    referenceId:{
        type: String
        
    },
    phoneNo:{
        type: Number
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
    addresses:[addressSchema],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    loginMethods: [{ 
        type: String, 
        enum: ['PhoneNo','Gmail','FaceBook']
        
    }]
},
     {timestamps:true} 

    )


    export const userModel =  mongoose.model('users',userSchema);