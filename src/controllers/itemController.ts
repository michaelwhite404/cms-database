import { Response, NextFunction } from "express";
import { testItemValidations } from "../utils/validations";
import catchAsync from "../utils/catchAsync";
import Item from "../models/itemModel";
import { defaultCollectonFields } from "../defaults";
import AppError from "../utils/appError";
import { CustomRequest, CustomCollectionRequest } from "../interfaces/customRequestInterface";
import { ItemModel, ItemFields, ItemField } from "../interfaces/itemInterfaces";
import { CollectionField, CollectionModel } from "../interfaces/collectionInterfaces";
import APIFeatures from "../utils/APIFeatures";
import objectIsEmpty from "../utils/objectIsEmpty";

/**
 * Connects each item field to a collection field
 * @param {ItemFields} itemFields The Item's Fields
 * @param {CollectionField[]} collectionFields The collection's fields
 * @returns {[[ItemField, CollectionField][], CollectionField[]]} An array where the
 *    zeroth index is an array of arrays that connect the item field to the collection
 *    field and the first index are collection fields with no attached item field
 */
const connectFields = (
	itemFields: ItemFields,
	collectionFields: CollectionField[]
): [[ItemField, CollectionField][], CollectionField[]] => {
	let itemFieldArray: [ItemField, CollectionField][] = [];
	collectionFields.forEach((field) => {
		const itemFieldValue = itemFields[field.slug];
		// If the value has a matching field in the collection fields
		if (itemFieldValue !== undefined) {
			// Delete Item Field Property
			delete itemFields[field.slug];
			// Delete collection field
			collectionFields = collectionFields.filter((f) => f.slug != field.slug);
			// Push value and field togther into array
			itemFieldArray.push([itemFieldValue, field]);
		}
	});
	return [itemFieldArray, collectionFields];
};

/**
 * Checks if any of the item fields are not in the schema
 * @param {ItemFields} itemFields The item fields not connected to a collection field
 * @returns {[boolean, string]} An array that shows whether the object has any
 *    properties left and and message explaining the result
 */
const checkInSchema = (itemFields: ItemFields): [boolean, string] => {
	if (!objectIsEmpty(itemFields)) {
		const badFields = Object.keys(itemFields).join(", ");
		const words = Object.keys(itemFields).length == 1 ? ["key", "is"] : ["keys", "are"];
		// return next(
		//   new AppError(
		//     `The ${words[0]} '${badFields}' ${words[1]} not a part of the collection's schema`,
		//     400
		//   )
		// );
		return [
			false,
			`The ${words[0]} '${badFields}' ${words[1]} not a part of the collection's schema`,
		];
	}
	return [true, "All items fields are in the schema"];
};

/**
 * Checks if any collection fields without an item field is a required field
 * @param {CollectionField[]} leftoverFields Collection fields not connected to an item field
 * @returns {[boolean, string]} An array that shows whether any of the missing
 *    collection fields are required and a message explaining the result
 */
const checkMissingRequiredFields = (leftoverFields: CollectionField[]): [boolean, string] => {
	const missingRequiredFields = leftoverFields.filter((field) => {
		return field.required === true;
	});
	// If the collection has missing required fields
	if (missingRequiredFields.length > 0) {
		const missingNames = missingRequiredFields.map((field) => field.slug);
		const word = Object.keys(missingNames).length == 1 ? "is a" : "are";
		missingNames.join(", ");
		return [false, `'${missingNames}' ${word} required field${word == "are" ? "s" : ""}`];
	}
	return [true, "All required fields have values"];
};

/**
 * Instantiates item fields and collection fields to work with in the controller
 * @param {CustomCollectionRequest<ItemModel, CollectionModel>} req Custom Express request object
 * @returns {CollectionField[]} An array of collection fields editable to the user
 * @returns {ItemFields} Item fields from from the request body
 */
const instantiateFields = (
	req: CustomCollectionRequest<ItemModel, CollectionModel>
): {
	collectionFields: CollectionField[];
	itemFields: ItemFields;
} => {
	/** The collection ths item will be added to */
	const collection = req.collection;
	// Fields
	let collectionFields = collection.fields;
	let itemFields: ItemFields = { ...req.body };

	// Delete default fields from body.fields if present
	defaultCollectonFields.forEach((field) => delete itemFields[field.slug]);
	// Delete default fields from collection fields
	collectionFields.splice(collectionFields.length - 4, 4);

	return { collectionFields, itemFields };
};

/**
 * Retrives all items in collection based on collection ID route parameter
 * @param {CustomRequest<ItemModel>} req Custom Express request object
 * @param {Response} res Express response object
 */
export const getAllItemsInCollection = catchAsync(
	async (req: CustomRequest<ItemModel>, res: Response) => {
		const features = new APIFeatures(
			Item.find({ _cid: req.params.collection_id }) /* .select("-_cid") */,
			req.query
		)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		const fetchedItems = await features.query.lean();
		const items = fetchedItems.map((i) => {
			delete i._cid;
			return i;
		});

		res.status(200).json({
			status: "success",
			results: items.length,
			page: features.page,
			limit: features.limit,
			_cid: req.params.collection_id,
			items,
		});
	}
);

/**
 * Retrieves collection item based on item ID & collection ID
 * @param {CustomRequest<ItemModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const getItem = catchAsync(
	async (req: CustomRequest<ItemModel>, res: Response, next: NextFunction) => {
		const item = await Item.findOne({
			_id: req.params.item_id,
			_cid: req.params.collection_id,
		});

		if (!item) return next(new AppError("There is no item with this ID", 404));

		res.status(200).json({
			status: "success",
			item,
		});
	}
);

/**
 * Creates new collection item. Item is added to the collection with the same
 * collection ID as the collection ID passed into the route parameter.
 * @param {CustomCollectionRequest<ItemModel, CollectionModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const createItem = catchAsync(
	async (
		req: CustomCollectionRequest<ItemModel, CollectionModel>,
		res: Response,
		next: NextFunction
	) => {
		if (!req.body || objectIsEmpty(req.body))
			return next(
				new AppError("No arguments are present. Please enter fields in the 'fields' object", 400)
			);

		let { itemFields, collectionFields } = instantiateFields(req);

		/** An array of arrays that contain item field value and the collection field */
		let itemFieldArray: [ItemField, CollectionField][];
		/** Collection fields left with no item fields */
		let leftoverFields: CollectionField[];
		[itemFieldArray, leftoverFields] = connectFields(itemFields, collectionFields);

		// Check if the body has fields not in the collection field schema
		const isInSchema = checkInSchema(itemFields);
		if (!isInSchema[0]) return next(new AppError(isInSchema[1], 400));

		// Check if any required fields are missing
		const passRequired = checkMissingRequiredFields(leftoverFields);
		if (!passRequired[0]) return next(new AppError(passRequired[1], 400));

		// Test Item Validations
		/** Object of item fields that have passed the validation test */
		const testedFields: ItemFields = {};
		for (const [itemField, collectionField] of itemFieldArray) {
			const [valid, message] = await testItemValidations(itemField, collectionField);
			// If validation failed
			if (!valid) return next(new AppError(message, 400));
			testedFields[collectionField.slug] = itemField;
		}
		/** Created Item */
		const item = await Item.create({
			_cid: req.params.collection_id,
			database: req.collection.database,
			...testedFields,
		});

		const displayedItem = JSON.parse(JSON.stringify(item._doc));
		displayedItem.database = undefined;

		res.status(201).json({
			status: "success",
			item: displayedItem,
		});
	}
);

/**
 * Deletes collection item based on collection ID & item ID parameters
 * @param {CustomRequest<ItemModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const deleteItem = catchAsync(
	async (req: CustomRequest<ItemModel>, res: Response, next: NextFunction) => {
		const item = await Item.findOneAndDelete({
			_id: req.params.item_id,
			_cid: req.params.collection_id,
		});

		if (!item) {
			return next(new AppError("There is no item with this ID", 404));
		}

		res.status(200).json({
			status: "success",
			itemsDeleted: 1,
		});
	}
);

/**
 * Updates item based on item ID and collection ID. Only replaces fields
 * that are existent in the body.
 * @param {CustomCollectionRequest<ItemModel, CollectionModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const patchItem = catchAsync(
	async (
		req: CustomCollectionRequest<ItemModel, CollectionModel>,
		res: Response,
		next: NextFunction
	) => {
		if (!req.body || objectIsEmpty(req.body))
			return next(new AppError("No arguments are present", 400));
		/** The item soon to be updated */
		let oldItem = await Item.findById({
			_id: req.params.item_id,
			_cid: req.params.collection_id,
		});

		if (!oldItem) {
			return next(new AppError("There is no item with this ID", 404));
		}
		let { itemFields, collectionFields } = instantiateFields(req);

		const [itemFieldArray] = connectFields(itemFields, collectionFields);

		// Check if the body has fields not in the collection field schema
		const isInSchema = checkInSchema(itemFields);
		if (!isInSchema[0]) return next(new AppError(isInSchema[1], 400));

		// Test Item Validations
		/** Object of item fields that have passed the validation test */
		const testedFields: ItemFields = {};
		for (const [itemField, collectionField] of itemFieldArray) {
			const [valid, message] = await testItemValidations(itemField, collectionField);
			// If validation failed
			if (!valid) return next(new AppError(message, 400));
			testedFields[collectionField.slug] = itemField;
		}

		const item = await Item.findByIdAndUpdate(
			{
				_id: req.params.item_id,
				_cid: req.params.collection_id,
			},
			{ ...req.body, "updated-on": new Date() },
			{ new: true }
		);

		if (!item) {
			return next(new AppError("There is no item with this ID", 404));
		}

		res.status(200).json({
			status: "sucess",
			item,
		});
	}
);

/**
 * Updates item based on item ID and collection ID. Replaces the fields of an
 * existent item with the fields specified in the body.
 * @param {CustomCollectionRequest<ItemModel, CollectionModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const putItem = catchAsync(
	async (
		req: CustomCollectionRequest<ItemModel, CollectionModel>,
		res: Response,
		next: NextFunction
	) => {
		if (!req.body || objectIsEmpty(req.body))
			return next(new AppError("No arguments are present", 400));

		/** The item soon to be updated */
		let oldItem = await Item.findById({
			_id: req.params.item_id,
			_cid: req.params.collection_id,
		}).select("+database");

		if (!oldItem) {
			return next(new AppError("There is no item with this ID", 404));
		}

		// /** The collection ths item will be added to */
		let { itemFields, collectionFields } = instantiateFields(req);

		const [itemFieldArray, leftoverFields] = connectFields(itemFields, collectionFields);

		// Check if the body has fields not in the collection field schema
		const isInSchema = checkInSchema(itemFields);
		if (!isInSchema[0]) return next(new AppError(isInSchema[1], 400));

		// Check if any required fields are missing
		const passRequired = checkMissingRequiredFields(leftoverFields);
		if (!passRequired[0]) return next(new AppError(passRequired[1], 400));

		// Test Item Validations
		/** Object of item fields that have passed the validation test */
		const testedFields: ItemFields = {};
		for (const [itemField, collectionField] of itemFieldArray) {
			const [valid, message] = await testItemValidations(itemField, collectionField);
			// If validation failed
			if (!valid) return next(new AppError(message, 400));
			testedFields[collectionField.slug] = itemField;
		}

		// If all Validations pass

		const update = {
			_cid: oldItem._cid,
			database: oldItem.database,
			...testedFields,
			"updated-on": new Date(),
			"created-on": oldItem["created-on"],
		};

		const updatedItem = await Item.findOneAndReplace(
			{
				_id: req.params.item_id,
				_cid: req.params.collection_id,
			},
			update,
			{ new: true }
		);
		// Take database out of output
		updatedItem!.database = undefined as unknown as string;

		res.status(200).json({
			status: "success",
			item: updatedItem,
		});
	}
);
