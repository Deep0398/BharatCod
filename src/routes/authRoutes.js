import express from "express"
// import passport from "passport";
import { getUserController, loginController, signUpController ,forgotPasswordController,searchUserController} from "../controller/user.controller.js";
import {searchProductByName,insertProduct, searchProductByCategory,updateProduct} from "../controller/product.controller.js";
import { addToCart,viewCart,updateCartItem,checkout } from "../controller/cart.controller.js";
import {addShippingAdress,updateShippingAddress,deleteShippingAddress,} from "../controller/shipping.controller.js";
 import {authenticateUser} from "../middleware/auth.middleware.js"
 import {placeOrder,trackOrder,cancelOrder} from "../controller/order.controller.js"
const userRouter = express.Router();
// Signup and log in

userRouter.post('/signup',signUpController);
userRouter.get('/get',getUserController);
userRouter.post('/login',loginController);
userRouter.get('/role/:role',searchUserController);

// Forgot password

 userRouter.post('/forgot',forgotPasswordController);
 userRouter.post('/forgot-password',forgotPasswordController);

//  get product by name
userRouter.post('/new-product',insertProduct);
 userRouter.get('/Product',searchProductByName);
 userRouter.get('/category',searchProductByCategory);
 userRouter.put('/update/:id',updateProduct);

 //order routes

 userRouter.post('/order/place',placeOrder)
 userRouter.get('/order/:orderid/status',trackOrder)
 userRouter.put('/order/:orderid/cancel',cancelOrder)

 //google sign in 

//  userRouter.get('/auth/google',passport.authenticate('google',{scope: ['profile','email']}))
//  userRouter.get('/auth/google/callback',passport.authenticate('google',
//  {failureRedirect:'/login',   
//  successRedirect:'/'
//  }))


// cart routes 
 userRouter.post('/cart/add',authenticateUser,addToCart);
userRouter.get('/cart',authenticateUser,viewCart)
userRouter.put('/cart/update/:itemId', authenticateUser,updateCartItem)
userRouter.post ('/cart/checkout',authenticateUser,checkout)

//shipping addresss routes

userRouter.post('/shipping/add',addShippingAdress);
 userRouter.put('/shipping/update/:_id',updateShippingAddress)
 userRouter.delete('/shipping/delete/:_id',deleteShippingAddress)



export default userRouter;
