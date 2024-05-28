import mongoose from 'mongoose';
import { Products } from './product.model.js';

const subcategorySchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }] // Reference the Products model
}, { _id: false });

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    parentName: { type: String }, 
    subcategories: [subcategorySchema],
    image: [{ type: String }]
});

 const CategoryModel = mongoose.model('Category', categorySchema);
 export default CategoryModel
