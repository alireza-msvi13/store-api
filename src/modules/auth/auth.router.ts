import express from "express";
import * as controller from "./auth.controller";

const router = express.Router();

router
    .route("/register")
    .post(controller.register);

// router.route("/refresh", controller.refreshToken);

// router.route("/login").get(controller.showLoginView).post(controller.login);

// router
//   .route("/forget-password")
//   .get(controller.showForgetPasswordView)
//   .post(controller.forgetPassword);

// router.route("/reset-password/:token").get(controller.showResetPasswordView);

// router.route("/reset-password").post(controller.resetPassword);

export default router
