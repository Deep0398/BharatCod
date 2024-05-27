import Order from "../models/order.model.js"
import {Products} from "../models/product.model.js";
import { userModel } from "../models/user.model.js";
import { sendOrderStatusEmail } from "./emailController.js";
import { Shipping } from "../models/shipping.model.js";
import CategoryModel from "../models/category.model.js";


export async function placeOrder(req, res) {
    try {
        
         const {items,userId} = req.body

         if(!items || !userId){
            return res.status(400).json({message:"Items or UserID is missing"})
         }
        const user = await userModel.findById(userId).populate('addresses')
        if(!user){
            return res.status(400).json({message:"User Not Found"})
        }
    for(const item of items){
        const { productId, quantity,orderAddress,title,salePrice,regularPrice,discount,category } = item;

        const product = await Products.findById(productId);
        if (!product) {
            return res.status(400).json({ message: "Product Not Found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Requested Quantity Not Available" });
        }
        console.log("Product Price:", product.price);
console.log("Quantity:", quantity);

let price = product.salePrice;
console.log(price)
        item.totalPrice = product.salePrice * quantity;
      item.title = product.title

     if(isNaN(item.totalPrice) || !isFinite(item.totalPrice)){
        return res.status(400).json({message:'Invalid total price for item'})
     }
    
    product.stock -= quantity
    product.sold += quantity
    await product.save()
    }
         const totalPrice = items.reduce((total, item) => total + item.totalPrice, 0);
         if(isNaN(totalPrice) || !isFinite(totalPrice)){
            return res.status(400).json({message:'Invalid total price for Order'})
         }

        const orderItems = items.map(item =>{
            const { productId, quantity, totalPrice, orderAddress,title} = item;
            return {
                title: title,
            productId : productId,
            quantity : quantity,
            totalPrice : totalPrice,
            orderAddress: orderAddress,
           
            }
        })

        const order = new Order({
            userId: userId,
            name : user.name,
            items: orderItems,
            totalPrice: totalPrice,
            status: "placed",
            // createdAt: new Date(),
            // updatedAt: new Date()
           
        });


        console.log("Order",order)
        await order.save();

        user.orders = user.orders || [];
        user.orders.push(order)

        console.log(user)

        await user.save();
        const email = user.email;
        const subject = 'Order Placed Successfully';
        const text = `Your order with ID ${order._id} has been successfully placed. We will notify you once the order is shipped.`;

        console.log(`Preparing to send email to: ${email}, Subject: ${subject}, Text: ${text}`);
        await sendOrderStatusEmail(email, subject, text);

        return res.status(200).json(order);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function trackOrder(req, res) {
    try {
        const userId = req.params.userId.toString();
        const orders = await Order.find({ userId: userId }).populate({
            path: 'items.productId',
            model: Products,
            select: 'title price'
        });

        console.log(orders);
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "Order Not Found" });
        }

        const orderDetails = orders.map(order => {
            const items = order.items.map(item => {
                if (!item.productId) {
                    return null; // Handle null productId
                }
                return {
                    productId: item.productId._id || null, // Ensure productId is not null
                    title: item.productId.title || "", // Ensure title is not null
                    price: item.productId.salePrice || 0, // Ensure salePrice is not null
                    quantity: item.quantity || 0,
                    orderAddress: item.orderAddress || "",
                    totalPrice: item.totalPrice || 0
                };
            }).filter(item => item !== null); // Filter out null items

            return {
                orderId: order._id,
                status: order.status,
                name: order.name || "", // Ensure name is not null
                totalPrice: order.totalPrice || 0, // Ensure totalPrice is not null
                items: items,
                createdAt: order.createdAt
            };
        });

        return res.status(200).json(orderDetails);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
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
    const user = await userModel.findById(order.userId);
    if (user) {
        const email = user.email;
        const subject = `Order Status Updated to ${newStatus}`;
        const text = `Your order with ID ${orderId} has been updated to ${newStatus}. If you have any questions, please contact our support team.`;

        console.log(`Preparing to send email to: ${email}, Subject: ${subject}, Text: ${text}`);
        await sendOrderStatusEmail(email, subject, text);
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
    const user = await userModel.findById(order.userId);
    if (user) {
        const email = user.email;
        const subject = 'Order Cancelled';
        const text = `Your order with ID ${orderId} has been cancelled. If you have any questions, please contact our support team.`;

        console.log(`Preparing to send email to: ${email}, Subject: ${subject}, Text: ${text}`);
        await sendOrderStatusEmail(email, subject, text);
    }
    return res.status(200).json({message:"Order Cancelled"})
}catch(error){
    console.log(error)
    return res.status(500).json({message:"Internal Server Error"})
}
}

export async function getAllOrders(req, res) {
    try {
        const orders = await Order.find().populate({
            path: 'items.productId',
            model: Products,
            select: 'title salePrice'
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        return res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}




























