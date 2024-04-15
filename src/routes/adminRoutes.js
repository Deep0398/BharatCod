import express from "express"
import { signupController,loginController } from "../controller/admin.controller.js";
import { checkAdminLogin } from "../middleware/auth.middleware.js"

const adminRouter = express.Router()

adminRouter.post("/",signupController);
adminRouter.post("/login",loginController);

export default adminRouter