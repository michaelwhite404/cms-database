const { default: slugify } = require("slugify");
const uniqBy = require("lodash.uniqby");
const Collection = require("../models/collectionModel");
const catchAsync = require("../utils/catchAsync");
const { defaultCollectonFields, defaultPrimaryName } = require("../defaults");
const AppError = require("../utils/appError");
const tests = require("../validations");

exports.getAllCollections = catchAsync(async (req, res) => {
  const collections = await Collection.find().select(
    "name singularName slug createdAt lastUpdated"
  );

  res.status(200).json({
    status: "success",
    results: collections.length,
    collections,
  });
});

exports.getCollection = catchAsync(async (req, res, next) => {
  const collection = await Collection.findById(req.params.collection_id);

  if (!collection) {
    return next(new AppError("There is no collection with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    collection,
  });
});

exports.createCollection = catchAsync(async (req, res, next) => {
  let fields = [];
  let pObj = {};
  if (!req.body.name)
    return next(new AppError("A Collection must have a name", 400));
  let bodyFields = req.body.fields;
  if (bodyFields) {
    if (uniqBy(bodyFields, "name").length < bodyFields.length)
      return next(new AppError("All fields must have diffferent names", 400));
    const pNameIndex = [];
    bodyFields.reduce((prev, field, index) => {
      if (field.primaryName == true) pNameIndex.push(index);
      return field;
    }, []);
    // If there is more than 1 primary name
    if (pNameIndex.length > 1)
      return next(new AppError("You cannot have multiple Primary Names", 400));
    if (pNameIndex.length === 1) {
      pObj = bodyFields.splice(pNameIndex[0], 1)[0];
      if (pObj.type !== "PlainText")
        return next(
          new AppError("Primary Name must be of type `PlainText`", 400)
        );
      pObj.slug = slugify(pObj.name, { lower: true });
      pObj.required = true;
      pObj.editable = true;
    } else {
      pObj = defaultPrimaryName;
    }
    fields.push(pObj);

    // Add Slug and Order Number
    for (let i = 0; i < bodyFields.length; i++) {
      const field = bodyFields[i];
      if (!tests.notReservedField(field.name))
        return next(new AppError(`'${field.name}' is a reserved name.`, 400));
      if (field.type === "User")
        return next(new AppError("User cannot set field as type `User`.", 400));
      fields.push({
        ...field,
        editable: true,
        slug: slugify(field.name, { lower: true }),
        order: i + 1,
      });
    }
  } else {
    fields.push(defaultPrimaryName);
  }
  fields.push(...defaultCollectonFields);
  const collection = await Collection.create({
    name: req.body.name,
    fields,
  });
  res.status(201).json({
    status: "success",
    collection,
  });
});

exports.updateCollection = catchAsync(async (req, res, next) => {
  // TODO
});

exports.deleteCollection = catchAsync(async (req, res, next) => {
  const collection = await Collection.findByIdAndDelete(
    req.params.collection_id
  );

  if (!collection) {
    return next(new AppError("There is no collection with this ID", 404));
  }

  // TODO
  // DELETE items with collection_id

  res.status(200).json({
    status: "success",
    collectionsDeleted: 1,
  });
});

exports.getCollectionFields = catchAsync(async (req, res, next) => {
  const colllection = await Collection.findById(req.params.collection_id);
  res.status(200).json({
    status: "success",
    fields: colllection.fields,
  });
});
