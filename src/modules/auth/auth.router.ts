import { Router } from "express";
import * as controller from "./auth.controller";
import authenticated from "../../middlewares/authenticated";


const router: Router = Router();



router.route("/register").post(controller.register);
router.route("/login").post(controller.login);
router.route("/me").get(authenticated, controller.getMe);
router.route("/refresh").post(authenticated, controller.refreshToken);
router.route("/forget-password").post(controller.forgetPassword);
router.route("/reset-password").post(controller.resetPassword);


export default router


