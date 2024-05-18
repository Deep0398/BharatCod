    import { Products } from "../models/product.model.js";
    import upload from "../middleware/multer.js";
    import urlJoin from "url-join";
    import CategoryModel from "../models/category.model.js";
    
 
    // insert a new product

    export async function insertProduct(req, res) {
        try {
            console.log('Kuldeep');
            const { title, description,regularPrice, salePrice,specification, category,color,size,rating,reviews,stock,sold,brand } = req.body;

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

            const categories = await CategoryModel.findOne({name:category});
            if (!categories) {
                return res.status(400).json({ message: "Invalid category" });
            }
            let discount = 0;
            if (salePrice < regularPrice) {
                discount = ((regularPrice - salePrice) / regularPrice) * 100;
            }
            
            const product = new Products({
                title,
                description,
                regularPrice,
                salePrice,
                price: salePrice,
                discount,
                specification,
                category: category,
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

    export async function deleteProductController(req,res){
        try {
            const productId = req.params.productId
         
            const product = await Products.findById(productId)
            if(!product){
                return res.status(400).send({message:"Product Not Found"})
            }
            await Products.findByIdAndDelete(productId)
            return res.status(200).send({message:"Product Deleted sucessfully"})
        }catch(error){
            console.log(error)
            return res.status(500).send({message:"Internal Server Error"})
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
                price: product.salePrice,
                regularPrice: product.regularPrice,
                salePrice : product.salePrice,
                discount : product.discount,
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
        const { title, description, regularPrice, salePrice, specification, category, color, size, rating, reviews, stock, sold, brand} = req.body
        
        const regularPriceNum = parseFloat(regularPrice);
        const salePriceNum = parseFloat(salePrice);

        // Validate input values
        if (isNaN(regularPriceNum) || isNaN(salePriceNum) || regularPriceNum <= 0 || salePriceNum <= 0 || salePriceNum > regularPriceNum) {
            return res.status(400).json({ message: "Invalid pricing values" });
        }

        // Calculate the discount
        let discount = 0;
        if (salePriceNum < regularPriceNum) {
            discount = ((regularPriceNum - salePriceNum) / regularPriceNum) * 100;
        }
        const products = await Products.findByIdAndUpdate(id,{
            title, description, regularPrice, salePrice,price: salePrice, specification, category, color, size, rating, reviews, stock, sold, brand,discount
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

        let products;
        if (query.toLowerCase() === "men's clothing" || query.toLowerCase() === "women's clothing") {
            products = await Products.find({ title: query });
        } else {
        const products = await Products.find({
            title: {
                $regex: new RegExp(query, 'i')
            }
        })
    }
            const productsWithImages = products.map(product => {
                const images = [
                    product.productimage1 ? urlJoin(process.env.BASE_URL, product.productimage1.replace(/\\/g, '/')) : null,
                    product.productimage2 ? urlJoin(process.env.BASE_URL, product.productimage2.replace(/\\/g, '/')) : null,
                    product.productimage3 ? urlJoin(process.env.BASE_URL, product.productimage3.replace(/\\/g, '/')) : null
                ].filter(image => image !== null);
    
                return {
                    _id: product._id,
                    title: product.title,
                    description: product.description,
                    price: product.salePrice,
                    regularPrice: product.regularPrice,
                    salePrice: product.salePrice,
                    specification: product.specification,
                    category: product.category,
                    color: product.color,
                    size: product.size,
                    reviews: product.reviews,
                    rating: product.rating,
                    stock: product.stock,
                    sold: product.sold,
                    brand: product.brand,
                    images: images,
                    discount:product.discount
                };
            });
            console.log(productsWithImages)
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
        let products;
        if (query.toLowerCase() === "men's clothing" || query.toLowerCase() === "women's clothing") {
            products = await Products.find({ category: query });
        } else {
         products = await Products.find({
            category: {
                $regex: new RegExp(query, 'i')
            }
        })
        }
        const productsWithImages = products.map(product => {
            const images = [
                product.productimage1 ? urlJoin(process.env.BASE_URL, product.productimage1.replace(/\\/g, '/')) : null,
                product.productimage2 ? urlJoin(process.env.BASE_URL, product.productimage2.replace(/\\/g, '/')) : null,
                product.productimage3 ? urlJoin(process.env.BASE_URL, product.productimage3.replace(/\\/g, '/')) : null
            ].filter(image => image !== null);

            return {
                _id: product._id,
                title: product.title,
                description: product.description,
                price: product.salePrice,
                    regularPrice: product.regularPrice,
                    salePrice: product.salePrice,
                specification: product.specification,
                category: product.category,
                color: product.color,
                size: product.size,
                reviews: product.reviews,
                rating: product.rating,
                stock: product.stock,
                sold: product.sold,
                brand: product.brand,
                images: images,
                discount:product.discount
            };
        });
        return res.status(200).json(productsWithImages)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "internal server error"})
}
}

export async function getTopSaleProducts(req,res){
    try{
        const topSaleProducts = await Products.find().sort({sold: -1}).limit(20)
        const productsWithImages = topSaleProducts.map(product => {
            const images = [
                product.productimage1 ? urlJoin(process.env.BASE_URL, product.productimage1.replace(/\\/g, '/')) : null,
                product.productimage2 ? urlJoin(process.env.BASE_URL, product.productimage2.replace(/\\/g, '/')) : null,
                product.productimage3 ? urlJoin(process.env.BASE_URL, product.productimage3.replace(/\\/g, '/')) : null
            ].filter(image => image !== null);

            return {
                _id: product._id,
                title: product.title,
                description: product.description,
                price: product.salePrice,
                    regularPrice: product.regularPrice,
                    salePrice: product.salePrice,
                specification: product.specification,
                category: product.category,
                color: product.color,
                size: product.size,
                reviews: product.reviews,
                rating: product.rating,
                stock: product.stock,
                sold: product.sold,
                brand: product.brand,
                images: images,
                discount:product.discount
            };
        });
        console.log(productsWithImages)
        return res.status(200).json(productsWithImages)
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal server error"})
    }
}
