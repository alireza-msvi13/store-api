import { Router } from "express";
import * as controller from "./search.controller"; 
const router: Router = Router();

router.route("/:value").get(controller.get);

export default router;
