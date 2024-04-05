import { Products } from "../models/product.model.js";


// insert a new product

export  async function insertProduct(req,res){
    try{
        const {name,description,price,specification,category} = req.body
        const products = new Products({
            name,description,price,specification,category
        })

        const result = await products.save()
        console.log("product saved")
        return res.status(200).json(result)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "internal server error"})
    }
}

export async function getProducts(req,res){
    try{
        const products = await Products.find()
        return res.status(200).json(products)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "internal server error"})
    }
}
//update a product

export async function updateProduct(req,res){
    try{
        const {id} = req.params
        const {name,description,price,specification,category} = req.body
        const products = await Products.findByIdAndUpdate(id,{
            name,description,price,specification,category
        },{new:true})
        console.log(products)
        return res.status(200).json(products)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "internal server error"})
    }
}


// Search products by name 
export  async function searchProductByName(req,res){
    try{
        let {query} = req.query

        query = String(query).trim()
        console.log("Received query:", query);

        if(!query){
            return res.status(400).json({message: "provide a query"})
        }

        const products = await Products.find({
            name: {
                $regex: new RegExp(query, 'i')
            }
        })
        return res.status(200).json(products)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "internal server error"})
}
}

// search products by category

export  async function searchProductByCategory(req,res){
    try{
        let {query} = req.query

        query = String(query).trim()
        console.log("Received query:", query);

        if(!query){
            return res.status(400).json({message: "provide a query"})
        }

        const products = await Products.find({
            category: {
                $regex: new RegExp(query, 'i')
            }
        })
        return res.status(200).json(products)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "internal server error"})
}
}


