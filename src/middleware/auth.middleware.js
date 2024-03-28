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