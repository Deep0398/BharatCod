import admin from "../config/firbaseAdmin.js";

export async function sendNotifications(req,res){
    const {title, body, tokens} = req.body

    if(!title || !body ||!tokens || !Array.isArray(tokens)){
        return res.status(400).json({message:"Title,body or token is missing"})
    } 

    const message = {
        notification :{
            title,
            body   
        },
        tokens: tokens
    }
    try {
        const response = await admin.messaging().sendMulticast(message);
        return res.status(200).json({ message: 'Notification sent successfully', response });
      } catch (error) {
        console.error('Error sending notification:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
      }
    
}