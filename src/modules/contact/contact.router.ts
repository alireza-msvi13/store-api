import { Router } from "express";
import * as controller from "./contact.controller";
import authenticated from "../../middlewares/authenticated";
import isAdmin from "../../middlewares/isAdmin";


const router: Router = Router();


router
    .route("/")
    .post(controller.create)
    .get(authenticated, isAdmin, controller.getAll);
router
    .route("/:id")
    .delete(authenticated, isAdmin, controller.remove);

router
    .route("/answer")
    .post(authenticated, isAdmin, controller.answer);



export default router