import { Router } from "express";
import * as databaseController from "../controllers/databaseController";
import * as authController from "../controllers/authController";
import collectionRouter from "./collectionRoutes";

/** Router for database routes*/
const router = Router();

router.use("/:database_id/collections", collectionRouter);

router.use(authController.protect);

router.route("/").get(databaseController.getAllDatabases).post(databaseController.createDatabase);
router.post("/:database_id/share", databaseController.shareDatabase);
router
	.route("/:database_id")
	.get(databaseController.getDatabase)
	.patch(databaseController.updateDatabase)
	.delete(databaseController.deleteDatabase);

router.route("/:database_id/share");

export default router;
