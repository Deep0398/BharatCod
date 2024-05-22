import { userModel } from "../models/user.model.js";
import { Products } from "../models/product.model.js";
import mongoose from "mongoose";

// Middleware to add a product to the recently viewed list
export async function addToRecentlyViewed(req, res, next) {
    try {
      const userId = req.user._id;
      const productId = req.params.productId;
  
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID format' });
      }
      const product = await Products.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const user = await userModel.findByIdAndUpdate(
        userId,
        { $addToSet: { recentlyViewed: productId } },
        { new: true }
      ).populate('recentlyViewed');
  
      res.status(200).json(user.recentlyViewed);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };