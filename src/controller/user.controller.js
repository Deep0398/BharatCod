import { userModel } from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';



export async function signUpController(req,res){
    try {
        const { name,email, password } = req.body;
    
        //  Validate email format

         if (!validator.isEmail(email)) {
           return res.status(400).send('Invalid email format');
         }
        
        //  Check if the email is already registered
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
          return res.status(400).send('Email is already registered');
        }

        // //Phone no. validation 
        // const phoneRegex = /^\d{10}$/;
        // // // console.log('Phone',phone)
        // // // console.log('Regex Test',phoneRegex.test(test));
        // // if (!phoneRegex.test(phone)) {
        // //   return res.status(400).send('Invalid phone number');
        // }


        //  Hash password during registration

        const hashedPassword = await bcrypt.hash(password, 10);  

    const newUser = new userModel({ name,email, password: hashedPassword,phone, role });
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