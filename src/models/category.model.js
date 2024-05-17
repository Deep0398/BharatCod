import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

 const CategoryModel = mongoose.model('Category', categorySchema);
 export default CategoryModel
