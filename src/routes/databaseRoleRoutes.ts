import { Router } from "express";

import * as databaseRoleController from "../controllers/databaseRoleController";

const router = Router();

router.patch("/pinned/:database_id", databaseRoleController.togglePinned);

export default router;
