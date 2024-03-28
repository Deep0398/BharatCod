import { Shipping } from "../models/shipping.model.js";
// add shipping adres 

export async function addShippingAdress(req,res){
    try {
        const {name,address,city,state,country,zip,phone,email,otheraddress,orderNote}=req.body

        const newShipppingAdress= new Shipping({
            name,address,city,state,country,zip,phone,email,otheraddress,orderNote
        })
        await newShipppingAdress.save()
        res.status(201).json({message:"Address added successfully",shippingAddress:newShipppingAdress})
    }catch(error){
     
        console.log(error)
        res.status(500).json({message: "internal server error"})
    }
}

// Get Shipping Address

export async function getallShippingAddresses(req, res){
    try{
        const shippingAddresses=await Shipping.find()
        res.status(200).json({shippingAddresses})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "internal server error"})
    }
}
//edit shipping adress

export async function updateShippingAddress(req,res){
    try {
       const {_id}=req.params
       const updateFields = req.body

       const updatedAdress = await Shipping.findByIdAndUpdate({_id}, updateFields,{new:true})

       if(!updatedAdress)
       {
        return res.status(404).json({message: "Address not found"})
       }
       res.status(200).json({message:"Address updated Sucessfully",shippingAddress:updatedAdress})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "internal server error"})
    }


}

// delete shipping adress

export async function deleteShippingAddress(req,res){
    try {
        const {_id}=req.params
        const deletedAdress = await Shipping.findByIdAndDelete({_id})
        if(!deletedAdress)
        {
            return res.status(404).json({message: "Address not found"})
        }
        res.status(200).json({message:"Address deleted Sucessfully",shippingAddress:deletedAdress})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "internal server error"})
    }
}

