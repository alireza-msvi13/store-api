import { Router } from "express";
import * as controller from "./user.controller";
import authenticated from "../../middlewares/authenticated";
import isAdmin from "../../middlewares/isAdmin";


const router: Router = Router();



router.route("/").get(authenticated, isAdmin, controller.getAll);
router.route("/edit/:id").put(authenticated, isAdmin, controller.editUser);
router.route("/remove/:id").delete(authenticated, isAdmin, controller.removeUser);
router.route("/update").put(authenticated, controller.updateUser);
router.route("/role").put(authenticated, isAdmin, controller.changeUserRole);
router.route("/orders").put(authenticated, controller.getUserOrders);
router.route("/ban/:id").post(authenticated, isAdmin , controller.banUser);



export default router
