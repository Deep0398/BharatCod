import Order from "../models/order.model.js"
import {Products} from "../models/product.model.js";
import { userModel } from "../models/user.model.js";
import { Shipping } from "../models/shipping.model.js";


export async function placeOrder(req, res) {
    try {
        // const { productId, quantity, userId,orderAddress } = req.body;

        // if (!productId || !quantity || !userId || !orderAddress) {
        //     return res.status(400).json({ message: "ProductId, quantity, or userId is missing" });
        // }
         const {items,userId} = req.body

         if(!items || !userId){
            return res.status(400).json({message:"Items or UserID is missing"})
         }
        const user = await userModel.findById(userId).populate('addresses')
        if(!user){
            return res.status(400).json({message:"User Not Found"})
        }
    for(const item of items){
        const { productId, quantity, orderAddress } = item;

        const product = await Products.findById(productId);
        if (!product) {
            return res.status(400).json({ message: "Product Not Found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Requested Quantity Not Available" });
        }
        item.totalPrice = product.price * quantity;
    

        // const user = await userModel.findById(userId).populate('addresses');
        // if (!user) {
        //     return res.status(400).json({ message: "User Not Found" });
        // }

     if(isNaN(item.totalPrice) || !isFinite(item.totalPrice)){
        return res.status(400).json({message:'Invalid total price for item'})
     }
    }

         const totalPrice = items.reduce((total, item) => total + item.totalPrice, 0);
         if(isNaN(totalPrice) || !isFinite(totalPrice)){
            return res.status(400).json({message:'Invalid total price for Order'})
         }

        const orderItems = items.map(item =>{
            const { productId, quantity, totalPrice, orderAddress } = item;
            return {
            productId : item.productId,
            quantity : item.quantity,
            totalPrice : item.totalPrice,
            orderAddress: item.orderAddress
            }
        })

        const order = new Order({
            userId: userId,
            items: orderItems,
            totalPrice: totalPrice
           
        });

        await order.save();
        return res.status(201).json(order);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// }

//track order 

export async function trackOrder(req,res){
    try {
        const userId = req.params.userId.toString()
        const orders = await Order.find({ userId: userId }).populate({
            path: 'items.productId',
            model: Products,
            select: 'title price'
        })

        console.log(orders)
        if(!orders){
            return res.status(404).json({message:"Order Not Found"})
        }

        const orderDetails = orders.map(order =>({
            orderId:order._id,
            status:order.status,
            items:order.items && order.items.map(item=>({
                productId:item.productId._id,
                title:item.productId.title,
                price:item.productId.price,
                quantity:item.quantity,
                orderAddress:item.orderAddress,
                totalPrice:item.totalPrice
            })),
            createdAt: order.createdAt
        }))
        return res.status(200).json(orderDetails)
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}


export async function updateOrderStatusController(req,res){
    try{
        const orderId = req.params.orderId
        const newStatus = req.body.status

        if (!newStatus){
            return res.status(400).json({message:"Status is required"})
        }
      const order = await Order.findByIdAndUpdate(orderId,{status:newStatus},{new:true});
    if(!order){
        return res.status(404).json({message:"Order Not Found"})
    }
    return res.status(200).json(order)
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}
// Cancel order 

export async function cancelOrder(req,res){
    try{
        const orderId=req.params.orderId
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message:"Order Not Found"})
        }
        if(order.status ==="canceled"){
            return res.status(401).json({message:"Order Already Cancelled"})
        }
        order.status = "canceled"
        await order.save();

        for (const item of order.items){
            await Products.findByIdAndUpdate(item.productId,{$inc:{quantity:item.quantity}})
    }
    return res.status(200).json({message:"Order Cancelled"})
}catch(error){
    console.log(error)
    return res.status(500).json({message:"Internal Server Error"})
}
}



























