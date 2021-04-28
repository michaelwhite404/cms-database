import { Router } from "express";
import * as databaseController from "../controllers/databaseController";
import * as authController from "../controllers/authController";
import collectionRouter from "./collectionRoutes";

/** Router for database routes*/
const router = Router();

router.use("/:database_id/collections", collectionRouter);

router.use(authController.protect);

router.get(["/", "/roles"], databaseController.getAllDatabases);
router.post("/", databaseController.createDatabase);

router.use("/:database_id", databaseController.hasAccess);

router.post(
	"/:database_id/share",
	authController.restrictTo("owner", "editor"),
	databaseController.shareDatabase
);
router
	.route("/:database_id")
	.get(databaseController.getDatabase)
	.patch(authController.restrictTo("owner", "editor"), databaseController.updateDatabase)
	.delete(authController.restrictTo("owner"), databaseController.deleteDatabase);

export default router;
