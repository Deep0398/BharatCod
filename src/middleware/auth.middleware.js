import  jwt  from "jsonwebtoken";


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
    console.log("Decoded Token:",decoded)
    console.log("userID:",decoded.userID)
    req.user = decoded
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
        const accessToken = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(accessToken,secretKey);
        req._id = decoded?._doc?._id;
        next();
    } catch (err) {
        return res.send(error(500,err.message));
    }
}