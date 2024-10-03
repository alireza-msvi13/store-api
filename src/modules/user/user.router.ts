import { Router } from "express";
import * as controller from "./user.controller";
import authenticated from "../../middlewares/authenticated";
import isAdmin from "../../middlewares/isAdmin";


const router: Router = Router();



router.route("/").get(authenticated, isAdmin, controller.getAll);
router.route("/edit/:id").put(authenticated, isAdmin, controller.editUser);
router.route("/update").put(authenticated, controller.updateUser);



export default router
