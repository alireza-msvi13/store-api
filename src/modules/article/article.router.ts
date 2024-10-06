import { Router } from "express";
import * as controller from "./article.controller";
import authenticated from "../../middlewares/authenticated";
import isAdmin from "../../middlewares/isAdmin";
import multer from 'multer';
import storage from "../../utils/multer";

const router: Router = Router();


router
    .route("/")
    .post(
        multer({ storage, limits: { fileSize: 1000000000 } }).single(
            "cover"
        ),
        authenticated,
        isAdmin,
        controller.create
    )
    .get(controller.getAll);

router.route("/:shortname").get(controller.getOne);

router
    .route("/draft")
    .post(
        authenticated,
        isAdmin,
        multer({ storage, limits: { fileSize: 1000000000 } }).single(
            "cover"
        ),
        controller.saveDraft
    );

router
    .route("/:id")
    .delete(authenticated, isAdmin, controller.remove);

export default router;