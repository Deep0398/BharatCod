import CategoryModel from "../models/category.model.js"
import upload from "../middleware/multer.js";
import urlJoin from "url-join";
import mongoose from "mongoose";


// Function to add a root category
export async function addCategory(req, res) {
    try {
        const { name } = req.body;
        const imageFiles = req.files;
        if (!imageFiles || imageFiles.length === 0) {
            return res.status(400).json({ message: 'Images are required' });
        }

        console.log(req.files);
        console.log(imageFiles);

        const imagePaths = imageFiles.map(file => file.path.replace(/\\/g, '/'));
        console.log(imagePaths);

        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = new CategoryModel({ name, image:imagePaths });
        const result = await category.save();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function addSubcategory(req, res) {
    try {
        const { name, parentId } = req.body;
        
        console.log('Received parentId type:', typeof parentId);
console.log('Received parentId:', parentId);
       
        if (!mongoose.Types.ObjectId.isValid(parentId)) {
            return res.status(400).json({ message: "Invalid parent ID format" });
        }
        const parentObjectId = new mongoose.Types.ObjectId(parentId);

        const parentCategory = await CategoryModel.findById(parentObjectId);
        if (!parentCategory) {
            return res.status(400).json({ message: "Parent category does not exist" });
        }

        const existingSubcategory = await CategoryModel.findOne({ name, parent: parentObjectId });
        if (existingSubcategory) {
            return res.status(400).json({ message: "Subcategory already exists under this parent" });
        }

        // Get parent category name
        const parentCategoryName = parentCategory.name;
 
        const subcategory = new CategoryModel({ 
            name,
            parent: parentObjectId,
            parentName: parentCategoryName, // Assign parent category name
        });

        const result = await subcategory.save();

        // Update parent category with new subcategory
        parentCategory.subcategories.push({ id: result._id, name: result.name })
        await parentCategory.save();

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Function to add a subcategory
 //export async function addSubcategory(req, res) {
//     try {
//         const { name, parentId } = req.body;
//         const imageFiles = req.files;
//         if (!imageFiles || imageFiles.length === 0) {
//             return res.status(400).json({ message: 'Images are required' });
//         }

//         console.log(req.files);
//         console.log(imageFiles);

//         const imagePaths = imageFiles.map(file => file.path.replace(/\\/g, '/'));
//         console.log(imagePaths);


//         const parentCategory = await CategoryModel.findById(parentId);
//         if (!parentCategory) {
//             return res.status(400).json({ message: "Parent category does not exist" });
//         }

//         const existingSubcategory = await CategoryModel.findOne({ name, parent: parentId });
//         if (existingSubcategory) {
//             return res.status(400).json({ message: "Subcategory already exists under this parent" });
//         }

//         const subcategory = new CategoryModel({ 
//             name,
//             parent: parentId,
//             image: imagePaths // Assign the image to the subcategory
//         });

//         const result = await subcategory.save();

//         // Update parent category with new subcategory
//         parentCategory.subcategories.push(result._id);
//         await parentCategory.save();

//         return res.status(200).json(result);
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }

export async function getCategories(req, res) {
    try {
        const categories = await CategoryModel.find({ parent: null }).populate('subcategories');
        const categoryWithImages = categories.map(category =>{
            console.log(category)
            const image = (category.image || []).map(image => urlJoin(process.env.BASE_URL, image.replace(/\\/g, '/')));
        return {
            _id : category._id,
            name : category.name,
            subcategories: category.subcategories,
            image: image
        }
        
        })
        return res.status(200).json(categoryWithImages);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteCategory(req, res) {
    try {
        const categoryId = req.params.categoryId;

        const category = await CategoryModel.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export async function updateCategory(req, res) {
    try {
        const categoryId = req.params.categoryId;
        const { name } = req.body;

        const category = await CategoryModel.findByIdAndUpdate(categoryId, { name }, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json(category);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
