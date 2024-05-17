import express from "express"
import { signupController,loginController,changeUserRoleController} from "../controller/admin.controller.js";
import { checkAdminLogin } from "../middleware/auth.middleware.js"
import { deleteProductController } from "../controller/product.controller.js";
import { deleteUserController } from "../controller/user.controller.js";
import { addCategory,getCategories,deleteCategory,updateCategory } from "../controller/category.controller.js";
const adminRouter = express.Router()

adminRouter.post("/signup",signupController);
adminRouter.post("/login",loginController);
adminRouter.put('/changeUserRole/:userId',checkAdminLogin,changeUserRoleController)
adminRouter.delete('/deleteProducts/:productId',deleteProductController)
adminRouter.delete('/deleteUser',checkAdminLogin,deleteUserController)
adminRouter.post('/addcategory',addCategory)
adminRouter.get('/getcategory',getCategories)
adminRouter.delete('/deletecategory',deleteCategory)
adminRouter.put('/updatecategory',updateCategory)
export default adminRouter