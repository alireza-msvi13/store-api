import { Router } from "express";
import * as controller from "./menu.controller";
import authenticated from "../../middlewares/authenticated";
import isAdmin from "../../middlewares/isAdmin";


const router: Router = Router();


router
    .route('/')
    .get(controller.getAll)
    .post(authenticated, isAdmin, controller.create);

router.get('/all', controller.getAllPanelMenus)
  router.get('/topbar', controller.getAllTopbarLinks)

  router
  .route("/:id")
  .delete(authenticated, isAdmin, controller.remove)

export default router;
