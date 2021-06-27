import { Router } from "express";
import * as itemController from "../controllers/itemController";
import * as authController from "../controllers/authController";

/** Router for item routes */
const router = Router({ mergeParams: true });

// router.use(itemController.setCollectionId, itemController.collectionExists);

router
	.route("/")
	.get(itemController.getAllItemsInCollection)
	.post(authController.restrictTo("owner", "editor"), itemController.createItem);

router.post(["/fake", "/fake/:number"], itemController.createFakeItem);

router.get("/:item_id", itemController.getItem);
router.use(authController.restrictTo("owner", "editor"));
router
	.route("/:item_id")
	.put(itemController.putItem)
	.patch(itemController.patchItem)
	.delete(itemController.deleteItem);

export default router;
