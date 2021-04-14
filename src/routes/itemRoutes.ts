import { Router } from "express";
import * as itemController from "../controllers/itemController";

/** Router for item routes */
const router = Router({ mergeParams: true });

router.use(itemController.setCollectionId, itemController.collectionExists);

router
  .route("/")
  .get(itemController.getAllItemsInCollection)
  .post(itemController.createItem);

router
  .route("/:item_id")
  .get(itemController.getItem)
  .put(itemController.putItem)
  .patch(itemController.patchItem)
  .delete(itemController.deleteItem);

export default router;
