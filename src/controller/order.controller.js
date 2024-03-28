import Order from "../models/order.model.js"
import {Products} from "../models/product.model.js";


export async function placeOrder(req,res){
    try {
        // console.log("Request Body",req.body)
        const {productId, quantity, userId} = req.body

        if(!productId || !quantity || !userId){
            return res.status(400).json({message:"ProductId, quantity, or userId is missing"})
        }

        const product = await Products.findById(productId);
        if(!product){
            return res.status(400).json({message:"Product Not Found"})
        }

        const totalPrice= product.price*quantity

        const order = new Order ({
            userId:userId,
            items:[{
                productId:productId, 
                quantity:quantity,
                totalPrice:totalPrice
            }],
            totalPrice:totalPrice
        })
        // console.log("Order Object", order)
        await order.save()
        return res.status(201).json(order)
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

//track order 

export async function trackOrder(req,res){
    try {
        const orderId = req.params.orderId
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message:"Order Not Found"})
        }
        return res.status(200).json(order.status)
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
            return res.status(400).json({message:"Order Already Cancelled"})
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



























