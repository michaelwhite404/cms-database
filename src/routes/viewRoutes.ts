import { Router } from "express";

import * as viewController from "../controllers/viewController";
import * as authController from "../controllers/authController";

const router = Router();

router.use(authController.protect);

router.get("/dashboard", viewController.getDashboardData);
router.get("/databases/:database_id", viewController.getAllProjectData);

export default router;
