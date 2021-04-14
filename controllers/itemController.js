const { testItemValidations } = require("../validations");
const catchAsync = require("../utils/catchAsync");
const Item = require("../models/itemModel");
const Collection = require("../models/collectionModel");
const { defaultCollectonFields } = require("../defaults");
const AppError = require("../utils/appError");

exports.setCollectionId = (req, res, next) => {
  if (!req.body._cid) req.body._cid = req.params.collection_id;
  next();
};

exports.collectionExists = catchAsync(async (req, res, next) => {
  if (!req.body._cid)
    next(new AppError("Collection ID is required but is not present", 404));
  const collection = await Collection.findById(req.body._cid);
  if (!collection) next(new AppError("There is no collection with this ID"));
  req.collection = collection;
  next();
});

exports.getAllItemsInCollection = catchAsync(async (req, res, next) => {
  const items = await Item.find({ _cid: req.body._cid });

  res.status(200).json({
    status: "success",
    results: items.length,
    _cid: req.body._cid,
    items,
  });
});

exports.getItem = catchAsync(async (req, res, next) => {
  const item = await Item.findOne({
    _id: req.params.item_id,
    _cid: req.body._cid,
  });

  if (!item) return next(new AppError("There is no item with this ID"));

  res.status(200).json({
    status: "success",
    item,
  });
});

exports.createItem = catchAsync(async (req, res, next) => {
  const collection = req.collection;
  // Fields
  let collectionFields = collection.fields;
  let itemFields = { ...req.body.fields };
  // Delete defualt fields
  defaultCollectonFields.forEach((field) => delete itemFields[field.slug]);
  collectionFields.splice(collectionFields.length - 4, 4);

  let itemFieldArray = [];
  collectionFields.forEach((field) => {
    const itemName = itemFields[field.slug];
    if (itemName !== undefined) {
      delete itemFields[field.slug];
      collectionFields = collectionFields.filter((f) => f.slug != field.slug);
      itemFieldArray.push(Array(itemName, field));
    }
  });

  // If the body has fields not in the schema
  if (Object.keys(itemFields).length > 0) {
    const badFields = Object.keys(itemFields).join(", ");
    const words =
      Object.keys(itemFields).length == 1 ? ["key", "is"] : ["keys", "are"];
    return next(
      new AppError(
        `The ${words[0]} '${badFields}' ${words[1]} not a part of the collection's schema`,
        400
      )
    );
  }

  // If the collection has missing required fields
  const missingRequiredFields = collectionFields.filter((field) => {
    return field.required === true;
  });
  if (missingRequiredFields.length > 0) {
    const missingNames = missingRequiredFields.map((field) => field.slug);
    const word = Object.keys(missingNames).length == 1 ? "is a" : "are";
    missingNames.join(", ");
    return next(
      new AppError(
        `\`${missingNames}\` ${word} required field${word == "are" ? "s" : ""}`,
        400
      )
    );
  }

  // console.log(itemFieldArray);
  // console.log("---------------------------");
  // console.log(missingRequiredFields);
  // console.log("---------------------------");
  // console.log(itemFields);

  // Test Item Validations
  const testedFields = {};
  for (const [item, field] of itemFieldArray) {
    const [valid, message] = testItemValidations(item, field);
    if (!valid) return next(new AppError(message, 400));
    testedFields[field.slug] = item;
  }

  const item = await Item.create({
    _cid: req.body._cid,
    ...testedFields,
  });

  res.status(201).json({
    status: "success",
    item,
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const item = await Item.findOneAndDelete({
    _id: req.params.item_id,
    _cid: req.body._cid,
  });

  if (!item) {
    return next(new AppError("There is no item with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    itemsDeleted: 1,
  });
});

exports.test = (req, res, next) => {
  const item = "mike@google.com";
  const field = {
    validations: {
      singleLine: true,
    },
    type: "Email",
    slug: "email",
    name: "Email Address",
  };
  const valid = testItemValidations(item, field);

  res.status(200).json({
    valid,
  });
};
