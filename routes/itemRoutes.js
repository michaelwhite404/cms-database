const router = require("express").Router({ mergeParams: true });
const itemController = require("../controllers/itemController");

router.use(itemController.setCollectionId, itemController.collectionExists);

router
  .route("/")
  .get(itemController.getAllItemsInCollection)
  .post(itemController.createItem);

router
  .route("/:item_id")
  .get(itemController.getItem)
  .delete(itemController.deleteItem);

router.route("/test").get(itemController.test);

module.exports = router;
