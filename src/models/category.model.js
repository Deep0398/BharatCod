import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    parentName: { type: String }, 
    subcategories: [{ 
        _id: false,
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        name: String
    }],
    image: [{ type: String, required: true }]
});

 const CategoryModel = mongoose.model('Category', categorySchema);
 export default CategoryModel
