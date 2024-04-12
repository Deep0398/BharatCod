import { Products } from "../models/product.model.js";
import upload from "../middleware/multer.js";

// insert a new product

<<<<<<< HEAD
export async function insertProduct(req, res) {
    try {
        console.log('Kuldeep');
        const { name, description, price, specification, category } = req.body;
=======
export  async function insertProduct(req,res,upload){
    try{
    
        const {name,description,price,specification,category} = req.body
         
        if(!req.file) {
            return res.status(400).json({message:"Image is missing"})
        }
        const image = req.file.path;
        const products = new Products({
            name,description,price,specification,category,image
        })
>>>>>>> 03660e8056337128574a07f3e24c7e7f9f01b64e

        const image = req.file; 
        console.log(image);
        
        if (!image) {
            return res.status(400).json({ message: "Image is missing" });
        }

        const imagePath = image.path; 
        
        const product = new Products({
            name,
            description,
            price,
            specification,
            category,
            image: imagePath // Assign the path to the product's image field
        });

        const result = await product.save();
        console.log("Product saved");
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
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
        const {name,description,price,specification,category,image} = req.body
        const products = await Products.findByIdAndUpdate(id,{
            name,description,price,specification,category,image
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


