import { Router } from "express";
import * as controller from "./auth.controller";
import authenticated from "../../middlewares/authenticated";


const router: Router = Router();



router.route("/register").post(controller.register);
router.route("/login").post(controller.login);
router.route("/me").get(authenticated, controller.getMe);
router.route("/refresh").get(authenticated, controller.refreshToken);



export default router



// router
//   .route("/forget-password")
//   .get(controller.showForgetPasswordView)
//   .post(controller.forgetPassword);

// router.route("/reset-password/:token").get(controller.showResetPasswordView);

// router.route("/reset-password").post(controller.resetPassword);

