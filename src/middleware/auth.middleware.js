import  jwt  from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import { Products } from "../models/product.model.js";


export async function authenticateUser(req, res, next){
       console.log ("Authentication successful")
       console.log("Headers",req.headers)

const token = req.headers.authorization?.split(" ")[1]

console.log('Token:', token)

if(!token){
    return res.status(401).json({message: "provide a token"})
}

try {
    const decoded = jwt.verify(token, 'greenwebsolutions')
    const userId = decoded.userID; 
    if (!userId) {
        return res.status(403).json({ message: 'User ID not provided in token' });
    }

    const user = await userModel.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    console.log("Decoded Token:",decoded)
    console.log("userID:",decoded.userID)
    req.user = user
    next()
}catch(err){
    return res.status(500).json({message:'Invalid Token'})

}
}

export async function checkAdminLogin(req,res,next){
    try {
        if (!req.headers?.authorization?.startsWith("Bearer")){
            return res.send(error(401,"authorization header is required"));
           }
           const secretKey = 'greenwebsolutions'
        const accessToken = req.headers.authorization.split(" ")[7];
        const decoded = jwt.verify(accessToken,secretKey);
        req._id = decoded?._doc?._id;
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).send({message:"Internal Server Error"})
    }
}