
import { Router } from "express";
import * as controller from "./ticket.controller";
import authenticated from "../../middlewares/authenticated";
import isAdmin from "../../middlewares/isAdmin";


const router: Router = Router();





router
  .route("/")
  .post(authenticated, controller.create)
  .get(authenticated, isAdmin, controller.getAll);

router.route("/user").get(authenticated, controller.userTickets);

router
  .route("/answer")
  .post(authenticated, isAdmin, controller.setAnswer);

router.route("/answer/:id").get(authenticated, controller.getAnswer);

export default router;