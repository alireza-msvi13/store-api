import { Router } from "express";
import * as controller from "./product.controller";
import authenticated from "../../middlewares/authenticated";
import isAdmin from "../../middlewares/isAdmin";
import multer from 'multer';
import storage from "../../utils/multer";

const router: Router = Router();


router
    .route("/")
    .post(
        authenticated,
        isAdmin,
        multer({ storage, limits: { fileSize: 1000000000 } }).single(
            "cover"
        ),
        controller.create
    )
    .get(controller.getAll);


router.route("/:id")
    .delete(authenticated, isAdmin, controller.remove)
    .put(
        authenticated,
        isAdmin,
        multer({ storage, limits: { fileSize: 1000000000 } }).single(
            "cover"
        ),
        controller.update
    )
    .get(controller.getOne)




export default router