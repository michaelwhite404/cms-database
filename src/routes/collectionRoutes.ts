import { Router } from "express";
import * as collectionController from "../controllers/collectionController";
import * as authController from "../controllers/authController";
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

router.use(authController.protect);

router
	.route("/:collection_id")
	.get(collectionController.getCollection)
	.patch(collectionController.updateCollection)
	.delete(collectionController.deleteCollection);

router.use(collectionController.setDatadaseId, collectionController.hasDatabaseAccess);

router
	.route("/")
	.get(collectionController.getAllCollectionsInDatabase)
	.post(collectionController.createCollection);

export default router;
