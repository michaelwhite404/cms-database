const router = require("express").Router();
const collectionController = require("../controllers/collectionController");
const Collection = require("../models/collectionModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const itemRouter = require("./itemRoutes");

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

router
  .route("/")
  .get(collectionController.getAllCollections)
  .post(collectionController.createCollection);

router
  .route("/:collection_id")
  .get(collectionController.getCollection)
  .delete(collectionController.deleteCollection);

router
  .route("/:collection_id/fields")
  .get(collectionController.getCollectionFields);

module.exports = router;
