import { Router } from "express";
import * as controller from "./off.controller";
import authenticated from "../../middlewares/authenticated";
import isAdmin from "../../middlewares/isAdmin";


const router: Router = Router();


router
    .route("/")
    .post(authenticated, isAdmin, controller.create)
    .get(authenticated, isAdmin, controller.getAll);

router
    .route("/all")
    .post(authenticated, isAdmin, controller.setOnAll)
    .delete(
        authenticated,
        isAdmin,
        controller.removeDiscounts
    );

router.route("/verfiy").post(authenticated, controller.verfiyDiscountCode);

router
    .route("/:id")
    .delete(authenticated, isAdmin, controller.remove);

export default router;
