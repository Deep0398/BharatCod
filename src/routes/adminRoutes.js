import express from "express"
import { signupController,loginController,changeUserRoleController} from "../controller/admin.controller.js";
import { checkAdminLogin } from "../middleware/auth.middleware.js"
import { deleteProductController } from "../controller/product.controller.js";
import { deleteUserController } from "../controller/user.controller.js";
const adminRouter = express.Router()

adminRouter.post("/signup",signupController);
adminRouter.post("/login",loginController);
adminRouter.put('/changeUserRole/:userId',checkAdminLogin,changeUserRoleController)
adminRouter.delete('/deleteProducts/:productId',checkAdminLogin,deleteProductController)
adminRouter.delete('/deleteUser',checkAdminLogin,deleteUserController)
export default adminRouter