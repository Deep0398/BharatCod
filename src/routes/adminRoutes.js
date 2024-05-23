import express from "express"
import { signupController,loginController,changeUserRoleController,getStaticsController,createPromotion,editPromotion,deletePromotion} from "../controller/admin.controller.js";
import { checkAdminLogin } from "../middleware/auth.middleware.js"
import { deleteProductController } from "../controller/product.controller.js";
import { deleteUserController,getAllUsers } from "../controller/user.controller.js";
import { addCategory,getCategories,deleteCategory,updateCategory } from "../controller/category.controller.js";
import { getAllOrders,updateOrderStatusController } from "../controller/order.controller.js";
const adminRouter = express.Router()

adminRouter.post("/signup",signupController);
adminRouter.post("/login",loginController);
adminRouter.put('/changeUserRole/:userId',checkAdminLogin,changeUserRoleController)
adminRouter.delete('/deleteProducts/:productId',deleteProductController)
adminRouter.delete('/deleteUser',checkAdminLogin,deleteUserController)
adminRouter.post('/addcategory',addCategory)
adminRouter.get('/getcategory',getCategories)
adminRouter.delete('/deletecategory/:categoryId',deleteCategory)
adminRouter.put('/updatecategory/:categoryId',updateCategory)
adminRouter.get('/getallorders',getAllOrders)
adminRouter.put('/order/:orderId/updateStatus',updateOrderStatusController)
adminRouter.get('/getAllUsers',getAllUsers)
adminRouter.get('/statistics', getStaticsController);
adminRouter.post('/createOffers',createPromotion)
adminRouter.put('/editOffers/:promotionId',editPromotion)
adminRouter.delete('/deleteOffers/:promotionId',deletePromotion)
export default adminRouter