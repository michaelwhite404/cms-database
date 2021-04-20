import { Router } from "express";
import * as collectionController from "../controllers/collectionController";
import itemRouter from "./itemRoutes";
import fieldRouter from "./fieldRoutes";

/** Router for collection routes */
const router = Router({ mergeParams: true });

/*router.param(
  "collection_id",
  catchAsync(async (req, res, next, id) => {
    const collection = await Collection.findById(req.params.collection_id);
    if (!collection)
      return next(new AppError("There is no collection with this ID", 404));
    next();
  })
); */

router.use("/:collection_id/items", itemRouter);
router.use("/:collection_id/fields", fieldRouter);

router
	.route("/")
	.get(
		collectionController.setDatadaseId,
		collectionController.validDatabase,
		collectionController.getAllCollectionsInDatabase
	)
	.post(
		collectionController.setDatadaseId,
		collectionController.validDatabase,
		collectionController.createCollection
	);

router
	.route("/:collection_id")
	.get(collectionController.getCollection)
	.patch(collectionController.updateCollection)
	.delete(collectionController.deleteCollection);

// router.route("/:collection_id/fields").get(collectionController.getCollectionFields);

export default router;
