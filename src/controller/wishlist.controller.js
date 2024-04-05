
import  {Wishlist}  from "../models/wishlist.model.js";
    import { Products } from "../models/product.model.js"

//Add to wishlist 
export async function addToWishlist(req, res) {

    const {userId,productId} = req.body;
    
    try{
        let wishlist = await Wishlist.findOne({userId})

        if (!wishlist){
            wishlist = new Wishlist({userId, products:[productId]})
        }else{
            if(!wishlist.products.includes(productId)){
                wishlist.products.push(productId)
        }else{
             return res.status(400).json({message:"Prodcut Already in wishlist"})   
        }
    }
    await wishlist.save()
    res.status(200).json(wishlist)
}catch(error){
    console.log(error)
res.status(500).json({message:"Internal Server Error"})
}
}

//to remove product from wishlist

export async function removeFromWishlist(req, res) {

    const {userId,productId} = req.body;
    
    try{
        let wishlist = await Wishlist.findOne({userId})

        if (!wishlist){
            return res.status(404).json({message:"Wishlist not found"})
        }

        if(wishlist.products.includes(productId)){
            wishlist.products.splice(wishlist.products.indexOf(productId),1)
        }else{
            return res.status(400).json({message:"Prodcut not in wishlist"})
        }
        await wishlist.save()
        console.log("Product Removed Sucessfully")
        res.status(200).json(wishlist)
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

//get wishlist for user

export async function getWishlist(req, res) {
   const {userId}=req.params;
   try{
    const wishlist = await Wishlist.findOne({userId})
    if (!wishlist){
        return res.status(404).json({message:"Wishlist not found"})
    }
    res.status(200).json(wishlist)
   } catch (err) {
       console.log(err);
       res.status(500).json({ message: 'Server error' });
   }

}


//share wishlist 

export async function shareWishlist(req,res){
    const {userId}= req.params
    try{
        const wishlist = await Wishlist.findOne({userId})
        if(!wishlist){
            return res.status(404).json({ message: "Wishlist not found"})
        }
        res.status(200).json(wishlist)
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}
