import { Router } from "express";
import * as collectionController from "../controllers/collectionController";
import * as authController from "../controllers/authController";
import itemRouter from "./itemRoutes";
import fieldRouter from "./fieldRoutes";

/** Router for collection routes */
const router = Router({ mergeParams: true });

router.use(authController.protect);

router.use(
	"/:collection_id",
	collectionController.getCollectionDatabase,
	collectionController.hasDatabaseAccess
);

router.use("/:collection_id/items", itemRouter);
router.use("/:collection_id/fields", fieldRouter);
// authController.restrictTo("owner", "editor"),
router
	.route("/:collection_id")
	.get(collectionController.getCollection)
	.patch(authController.restrictTo("owner", "editor"), collectionController.updateCollection)
	.delete(authController.restrictTo("owner", "editor"), collectionController.deleteCollection);

router.use(collectionController.setDatabaseId, collectionController.hasDatabaseAccess);

router
	.route("/")
	.get(collectionController.getAllCollectionsInDatabase)
	.post(authController.restrictTo("owner", "editor"), collectionController.createCollection);

export default router;
