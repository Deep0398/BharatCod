import CategoryModel from "../models/category.model.js"

export async function addCategory(req, res) {
    try {
        const { name } = req.body;

        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = new CategoryModel({ name });
        const result = await category.save();
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export async function getCategories(req, res) {
    try {
        const categories = await CategoryModel.find();
        return res.status(200).json(categories);
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
