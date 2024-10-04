import { Router } from "express";
import * as controller from "./category.controller";
import authenticated from "../../middlewares/authenticated";
import isAdmin from "../../middlewares/isAdmin";


const router: Router = Router();


router.route("/").post(authenticated, isAdmin, controller.create).get(controller.getAll);
router.route("/:id")
    .delete(authenticated, isAdmin, controller.remove)
    .put(authenticated, isAdmin, controller.update);

export default router
