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
    }
},
{timestamps:true} 

)




export const userModel =  mongoose.model('users',userSchema);
