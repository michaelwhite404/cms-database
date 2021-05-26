import { Router } from "express";

import * as viewController from "../controllers/viewController";
import * as authController from "../controllers/authController";

const router = Router();

router.use(authController.protect);

router.get("/dashboard", viewController.dashboardData);

export default router;
