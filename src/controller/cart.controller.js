import CartItem from "../models/cart.model.js";
import { Products } from "../models/product.model.js"
import Order from "../models/order.model.js"



export async function addToCart(req, res){
    console.log(req.user)
    
// Find product by ID from Products Schema by object ID 

    try{
        const {productId, quantity} = req.body   

        const product = await Products.findById(productId)
        if (!product)
        { return res.status(404).json({message: "Product not found"})}
    

    const totalPrice = product.salePrice * quantity;
    
//save that product to user by user ID to show in user account 

    const newItem= new CartItem({
        productId,
        quantity,
        price:product.salePrice,
        userID: req.user._id,
        totalPrice,
        discount: product.discount
    })
console.log(newItem)
    await newItem.save()
    res.status(200).json(newItem)

}catch (error){
    console.error(error);
    res.status(500).json({message: "internal server error"})
}
}

// to view cart with all products and total prices 

export async function viewCart(req, res) {
    try{
        const userId= req.user?req.user._id:null;
        const cartItems = await CartItem.find({userId}).populate('productId')

        let totalPrice = 0;
        for (const item of cartItems){
            totalPrice += item.productId.salePrice * item.quantity;
        }
        return res.status(200).json({cartItems, totalPrice})
    }catch (error){
        console.error(error);
        res.status(500).json({message: "internal server error"})
    }
}

// Update cart item with quantity price and save it to cart

export async function updateCartItem(req, res) {
    try{
        const {itemId}=req.params
        const {quantity}=req.body

        if (!itemId|| !quantity || quantity<=0){
         return res.status(400).json({message: "item id and quantity required"})
        } 
        const cartItem = await CartItem.findById(itemId)
        if(!cartItem){
            return res.status(404).json({message: "Cart item not found"})
    }
    cartItem.quantity = quantity
    cartItem.totalPrice = cartItem.productId.salePrice * quantity

    console.log('Updated cart Item ',cartItem)

    await cartItem.save()
    res.status(200).json(cartItem)
    }catch (error){
        console.error(error);
        res.status(500).json({message: "internal server error"})
    }
}

// checkout and clear cart items and save that order to our database 

export async function checkout(req, res) {
    try{
        const userId= req.user?req.user._id:null;
        const cartItems = await CartItem.find({userId}).populate('productId')

    if(!cartItems|| cartItems.length===0){
        return res.status(404).json({message: "Cart is empty"})
    }
     
    let totalPrice = 0;
    const orderItems = cartItems.map(item=>{
        totalPrice += item.productId.salePrice * item.quantity
        return {
            productId: item.productId._id,
            quantity: item.quantity,
            totalPrice: item.totalPrice
        }
    })

    const order = new Order ({
        userId,
        items:orderItems,
        totalPrice
    })

    await order.save()

await CartItem.deleteMany({userId})


    res.status(200).json({message: "Order placed ",order})
    }catch (error){
        console.error(error);
        res.status(500).json({message: "internal server error"})
    }
}
