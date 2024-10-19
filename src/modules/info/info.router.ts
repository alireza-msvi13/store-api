import { Router } from "express";
import * as controller from "./info.controller";
import authenticated from "../../middlewares/authenticated";
import isAdmin from "../../middlewares/isAdmin";


const router: Router = Router();



router
    .route("/")
    .get(authenticated, isAdmin, controller.info);


export default router