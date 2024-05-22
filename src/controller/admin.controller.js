import adminModel from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { userModel } from "../models/user.model.js";
import Order from "../models/order.model.js";



const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY || "greenwebsolutions";
const ADMIN_EMAIL = 'gwstelekuldeep@gmail.com'
export async function signupController(req,res){
    try {
        const {username,password,email} = req.body;
        if(!username || !password || !email){
            return res.send({message:"all fields are required"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        req.body["password"] = hashedPassword;
        const user = await adminModel.create(req.body);
        const  newuser = await adminModel.findById(user._id);
        return res.send({newuser});

    } catch (error) {
        return res.send({'error':error.message});
    }

}
// 
export async function loginController(req,res){
    try {
        const { email, password } = req.body;
        
        // Check if the provided email matches the admin email
        if(email !== ADMIN_EMAIL){
            return res.status(401).json({message: "Unauthorized access"});
        }

        // Fetch the admin user directly using the admin email
        const admin = await adminModel.findOne({ email }); 
        if(!admin){
            return res.status(404).json({message: "Admin not found"});
        }

        const matched = await bcrypt.compare(password, admin.password);
        if(!matched){
            return res.send({message: "Incorrect password"});
        }

        const token = jwt.sign({userID: admin._id}, ACCESS_SECRET_KEY, {expiresIn: '1h'});
        return res.status(200).json({message:"Login Successfully",admin, token});
    } catch (error) {
        return res.json({error: error.message});
    }
}

export async function changeUserRoleController(req,res){
    try{
        const {userId} = req.params
        const {role} = req.body

        if( !role){
            return res.status(400).send({message:"Role Required"})
        }
        const user = await userModel.findById(userId)

        if(!user){
            return res.status(404).send({message:"User Not Found"})
        }
        user.role = role
        await user.save()
        return res.status(200).send({message:"User role Updated sucessfully"})
    }catch(error){
        return res.status(500).send({message:"Internal server error"})
    }
}
 
export async function getStaticsController(req,res){
    try {
        const userCount = await userModel.countDocuments()

        const totalSalesResult = await Order.aggregate([
            {$match :{status : 'delivered'}},
            {$group :{_id: null, totalAmount:{$sum :'$totalPrice'} }}
        ])
        const totalSales = totalSalesResult[0] ? totalSalesResult[0].totalAmount : 0;

        const orderCount = await Order.countDocuments();
        const orderStatusCounts = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const statistics = {
            userCount,
            totalSales,
            orderCount,
            orderStatusCounts: orderStatusCounts.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {})
        };

        return res.status(200).json(statistics);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
    