    import { Products } from "../models/product.model.js";
    import upload from "../middleware/multer.js";
    import urlJoin from "url-join";
    

    // insert a new product

    export async function insertProduct(req, res) {
        try {
            console.log('Kuldeep');
            const { title, description, price, specification, category,color,size,rating,reviews,stock,sold,brand } = req.body;

            console.log(req.body)

            const productimage1 = req.files['productimage1'][0] ; 
            const productimage2 = req.files['productimage2'][0] 
            const productimage3 = req.files['productimage3'][0] ;
            
            if(!productimage1 || !productimage2 || !productimage3){
                return res.status(400).json({ message: "Image is missing" });
            }
            
            console.log(productimage1, productimage2, productimage3)

            const productimage1path = productimage1.path;
            const productimage2path = productimage2.path;
            const productimage3path = productimage3.path;
        
            console.log(productimage1path,productimage2path,productimage3path);
            
          
            
            const product = new Products({
                title,
                description,
                price,
                specification,
                category,
                color,
                size,
                reviews,
                rating,
                stock,
                sold,
                brand,
                productimage1: productimage1path,
                productimage2: productimage2path,
                productimage3: productimage3path
            
            });
    console.log(product)
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
        const productsWithImages = products.map(product => {
            console.log(product); // Log the product to see its structure
            const images = [
                product.productimage1 ? urlJoin(process.env.BASE_URL, product.productimage1.replace(/\\/g, '/')) : null,
                product.productimage2 ? urlJoin(process.env.BASE_URL, product.productimage2.replace(/\\/g, '/')) : null,
                product.productimage3 ?  urlJoin(process.env.BASE_URL, product.productimage3.replace(/\\/g, '/')) : null
            ].filter(image => image !== null); // Remove null values from the array
            return {
                _id: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                specification: product.specification,
                category: product.category,
                color:product.color,
                size:product.size,
                reviews:product.reviews,
                rating:product.rating,
                stock:product.stock,
                sold:product.sold,
                brand:product.brand,
                images: images
            };
        });
        
        return res.status(200).json(productsWithImages);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
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

// export async function getTopSaleProducts(req,res){
//     try{
//         const getTopSaleProducts = await Products.find().sort({sold: -1}).limit(20)
//     }
// }
