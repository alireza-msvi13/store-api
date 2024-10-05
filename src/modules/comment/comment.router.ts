import { Router } from "express";
import * as controller from "./comment.controller";
import authenticated from "../../middlewares/authenticated";
import isAdmin from "../../middlewares/isAdmin";


const router: Router = Router();


router
    .route("/")
    .post(authenticated, controller.create)
    .get(controller.getAll);

router
    .route("/:id")
    .delete(authenticated, isAdmin, controller.remove);

router
    .route("/answer/:id")
    .post(authenticated, controller.answer);

router
    .route("/accept/:id")
    .put(authenticated, isAdmin, controller.accept);

router
    .route("/reject/:id")
    .put(authenticated, isAdmin, controller.reject);


export default router