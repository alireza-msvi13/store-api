import { Router } from "express";
import * as controller from "./order.controller";
import authenticated from "../../middlewares/authenticated";
import isAdmin from "../../middlewares/isAdmin";


const router: Router = Router();


router.route("/").post(authenticated, controller.create);

router.route("/:id")
    .put(authenticated, isAdmin, controller.changeStatus);

export default router
