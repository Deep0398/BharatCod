import express from "express"
// import passport from "passport";
import { getUserController, loginController, signUpController ,forgotPasswordController,searchUserController,editUserController,uploadImageController,addAddressContoller,getUserAddressController,googleLoginController,phoneLoginController} from "../controller/user.controller.js";
import {searchProductByName,insertProduct, searchProductByCategory,updateProduct,getProducts} from "../controller/product.controller.js";
import { addToCart,viewCart,updateCartItem,checkout } from "../controller/cart.controller.js";
import {addShippingAdress,updateShippingAddress,deleteShippingAddress,} from "../controller/shipping.controller.js";
 import {authenticateUser} from "../middleware/auth.middleware.js"
 import {placeOrder,trackOrder,cancelOrder,updateOrderStatusController} from "../controller/order.controller.js"
import { addToWishlist,getWishlist,removeFromWishlist,shareWishlist } from "../controller/wishlist.controller.js";
 import upload from "../middleware/multer.js";


const userRouter = express.Router();

// Signup and log in

userRouter.post('/signup',signUpController);
userRouter.get('/get',getUserController);
userRouter.post('/login',loginController);
userRouter.post('/googleLogin',googleLoginController)
userRouter.post('/phoneNoLogin',phoneLoginController)
userRouter.get('/role/:role',searchUserController);
userRouter.put('/edit/:userId',editUserController)
userRouter.put('/upload/:userId',upload.single('image'),uploadImageController)
userRouter.post('/address/:userId',addAddressContoller)
userRouter.get('/getAddress/:userId',getUserAddressController)
// userRouter.put('/address/:userId',userAddressController)

// Forgot password

 userRouter.post('/forgot-password',forgotPasswordController);

//  get product by name
userRouter.post('/new-product',upload.fields([
    {name:'productimage1',maxcount: 1},
    {name:'productimage2',maxcount: 1},
    {name:'productimage3',maxcount: 1}
]),insertProduct);
 userRouter.get('/Product',searchProductByName);
 userRouter.get('/category',searchProductByCategory);
 userRouter.put('/update/:id',updateProduct);
 userRouter.get('/getAllProducts',getProducts)

 //order routes

 userRouter.post('/order/place',placeOrder)
 userRouter.get('/order/:userId/status',trackOrder)
 userRouter.put('/order/:orderId/cancel',cancelOrder)
 userRouter.put('/order/:orderId/updateStatus',updateOrderStatusController)

 //google sign in 

//  userRouter.get('/auth/google',passport.authenticate('google',{scope: ['profile','email']}))
//  userRouter.get('/auth/google/callback',passport.authenticate('google',
//  {failureRedirect:'/login',   
//  successRedirect:'/'
//  }))

//wishlist routes 
userRouter.post('/addtowishlist',addToWishlist)
userRouter.put('/remove/wishlist',removeFromWishlist)
userRouter.get('/get/wishlist/:userId',getWishlist)
userRouter.get('/share/wishlist/:userId',shareWishlist)

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
