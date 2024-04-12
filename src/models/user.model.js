import mongoose from "mongoose";

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


},
{timestamps:true} 

)


export const userModel =  mongoose.model('users',userSchema);