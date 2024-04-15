import { userModel } from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import upload  from "../middleware/multer.js";


export async function signUpController(req,res){
    try {
        const { name,email, password } = req.body;
    
        //  Check if the email is already registered
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
          return res.status(409).send('Email is already registered');
        }

        //  Hash password during registration

        const hashedPassword = await bcrypt.hash(password, 10);  

    const newUser = new userModel({ name,email, password: hashedPassword });
    await newUser.save();
    
        return res.status(200).send('User registered successfully');
      } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
      }

    }

// Get method for finding existing user

export async function getUserController(req, res) {
  try {
    const user = await userModel.find({});
    if (!user) {
      return res.status(404).send('User not found');
    }
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
}

//search user by role 

export async function searchUserController(req, res) {
  try {
    const { role } = req.body;
    const user = await userModel.find({ role });
    if (!user) {
      return res.status(404).send('User not found');
    }
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
}

// Login 
 export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    
// Hash Password durig login


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid password');
    }

    //  jwt token
     
    const token = jwt.sign({userID: user._id},'greenwebsolutions',{expiresIn:'1h'});
    return res.status(200).json({user, token});
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
}



// edit user details 

export async function editUserController(req,res){
  try {
    const {userId} = req.params
    const {name,location,city,country,zip,state,phone} = req.body
console.log(req.body)
    const existingUser = await userModel.findById(userId)
    if (!existingUser) {
      return res.status(404).send('User not found');
    }
    if(name){
      existingUser.name = name
    }
     
    if(location){
      existingUser.location = location
    }
if(city){
  existingUser.city = city
}
if(country){
  existingUser.country = country
}

if(zip){
  existingUser.zip = zip
}
if(phone){
  existingUser.phone = phone
}
if(state){
  existingUser.state = state
}
  
    await existingUser.save()
    console.log(existingUser)

    return res.status(200).send('User details updated successfully')
  }catch(error){
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
  }
}

export async function addAddressContoller(req,res){
  try{
    const {userId} = req.params
    const {name,location,city,country,zip,state,phone} = req.body

    console.log(req.body)

    const existingUser = await userModel.findById(userId)

    if(!existingUser){
      return res.status(404).send('User not found')
    }
    existingUser.addresses.push({name,location,city,country,zip,state,phone})

    await existingUser.save()
    return res.status(200).send('Address added successfully')

    // console.log(location)
  }catch (error){
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
  }
}

//get user address

export async function getUserAddressController(req, res) {
  try {
    const {userId} = req.params
    const existingUser = await userModel.findById(userId)

    if(!existingUser){
      return res.status(404).send('User not found')
    }
    const addresses = existingUser.addresses

    res.status(200).json(existingUser.addresses)
  }catch(error){
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
  }
}
// upload image file

export async function uploadImageController(req,res){
  try {
    const {userId} = req.params
    const user = await userModel.findById(userId)

    if(!user){
      return res.status(404).send('User not found')
    }
     const image = req.file

     if(!image){
      return res.status(404).send('Image not found')
     }
     user.image = image.path

     await user.save()

     return res.status(200).send('Image uploaded successfully')
  }catch(error){
    console.log(error)
    return res.status(500).json({message:"Internal Server Error"})
  }
}

// forgot password 

export async function forgotPasswordController(req, res) {
  try {
    const { email,password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).send('Invalid email format');
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }
     
    const token = jwt.sign({userID: user._id},'greenwebsolutions',{expiresIn:'1h'});


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '<EMAIL>',
        pass: '<PASSWORD>'
      }
    })
    
    const mailOptions = {
      from : 'your_mail@gmail.com',
      to : 'User_mail@gmail.com',
      subject : 'Reset Password',
      text : 'You are receiving this because you have requested to reset password of your account with Bharatlod.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://localhost:3000/resetPassword/' + token + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    }

user.resetPasswordToken = token;
user.resetPasswordExpiresIn = Date.now()+3600;
await user.save();



transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent:'+ info.response);
  }
})
  }catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}