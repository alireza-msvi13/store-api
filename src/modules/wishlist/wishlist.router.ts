import { Router } from "express";
import * as controller from "./wishlist.controller";
import authenticated from "../../middlewares/authenticated";


const router: Router = Router();


router.route("/").post(authenticated, controller.add).get(authenticated , controller.getAll);
router.route("/:id")
    .delete(authenticated, controller.remove)

export default router