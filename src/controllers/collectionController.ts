import { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import uniqBy from "lodash.uniqby";

import Collection from "../models/collectionModel";
import catchAsync from "../utils/catchAsync";
import { defaultCollectonFields, defaultPrimaryName } from "../defaults";
import AppError from "../utils/appError";
import { testCollectionValidations } from "../utils/validations";
import { CustomRequest } from "../interfaces/customRequestInterface";
import { CollectionField, CollectionModel } from "../interfaces/collectionInterfaces";
import APIFeatures from "../utils/APIFeatures";
import Database from "../models/databaseModel";
import { CustomCollectionField } from "../customCollectionField";

/**
 * Adds database id from route paramater to request body
 * @param {CustomRequest<CollectionModel>} req Custom Express request object
 * @param {NextFunction} next Express next middleware function
 */
export const setDatadaseId = (
	req: CustomRequest<CollectionModel>,
	_: Response,
	next: NextFunction
): void => {
	if (!req.body.database) req.body.database = req.params.database_id;
	next();
};

/**
 * Throws error if Database ID is neither present nor valid
 * @param {CustomCollectionRequest<ItemModel, CollectionModel>} req Custom Express request object
 * @param {NextFunction} next Express next middleware function
 */
export const validDatabase = catchAsync(
	async (req: CustomRequest<CollectionModel>, _: Response, next: NextFunction) => {
		if (!req.body.database)
			return next(new AppError("Database ID is required but is not present", 400));
		const database = await Database.findById(req.body.database);
		if (!database) return next(new AppError("There is no database with this ID", 404));
		next();
	}
);

/**
 * Retrieves all collections
 * @param {Request} req Custom Express request object
 * @param {Response} res Express response object
 */
export const getAllCollectionsInDatabase = catchAsync(
	async (req: CustomRequest<CollectionModel>, res: Response) => {
		const features = new APIFeatures<CollectionModel>(
			Collection.find({ database: req.body.database }),
			req.query
		)
			.filter()
			.sort()
			.limitFields("name", "singularName", "slug", "createdAt", "lastUpdated")
			.paginate();
		/** The collections that satisfy the query */
		const collections = await features.query;

		res.status(200).json({
			status: "success",
			/** The number of results that satisfy the query */
			results: collections.length,
			page: features.page,
			limit: features.limit,
			database: req.body.database,
			collections,
		});
	}
);

/**
 * Retrieves collection based on collection ID route parameter
 * @param {CustomRequest<CollectionModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const getCollection = catchAsync(
	async (req: CustomRequest<CollectionModel>, res: Response, next: NextFunction) => {
		/** Collection returned from the database */
		const collection = await Collection.findById(req.params.collection_id);
		// If no collection was found
		if (!collection) {
			return next(new AppError("There is no collection with this ID", 404));
		}

		res.status(200).json({
			status: "success",
			collection,
		});
	}
);

/**
 * Create a new collection
 * @param {CustomRequest<CollectionModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const createCollection = catchAsync(
	async (req: CustomRequest<CollectionModel>, res: Response, next: NextFunction) => {
		/** Array holding finalized collection fields */
		let fields: CollectionField[] = [];
		/** Object that holds the 'primaryName' property */
		let pObj = <CollectionField>{};
		// If the body does not have a 'name' property, throw error
		if (!req.body.name) return next(new AppError("A Collection must have a name", 400));
		// If a slug was set
		if (req.body.slug) req.body.slug = slugify(req.body.slug, { lower: true });
		const database = await Database.findById(req.body.database);
		if (!database) {
			return next(
				new AppError("A collection must be added to a valid database you have access to.", 400)
			);
		}
		// Fields must be a type of array
		if (req.body.fields && !Array.isArray(req.body.fields))
			return next(new AppError("'fields' must be a type of array", 400));
		/** An array copy of the collection fields from the request body */
		let bodyFields: CollectionField[] = [...req.body.fields];
		// If there are collection fields in the body
		if (bodyFields) {
			// If there are any duplicates, throw error
			if (uniqBy(bodyFields, "name").length < bodyFields.length)
				return next(new AppError("All fields must have diffferent names", 400));
			/** Holds the indexes of objects that have the property 'primaryName' as true */
			const pNameIndex: number[] = [];
			// Store all indexes of objects with the property 'primaryName'
			bodyFields.forEach((field, index) => {
				if (field.primaryName === true) pNameIndex.push(index);
			});

			// If there is more than 1 object that has the property 'primaryName' as true
			if (pNameIndex.length > 1)
				return next(new AppError("You cannot have multiple Primary Names", 400));
			// If there is only 1 object that has the property 'primaryName' as true
			if (pNameIndex.length === 1) {
				pObj = bodyFields.splice(pNameIndex[0], 1)[0];
				// If the 'primaryName' is not of type 'PlainText'
				if (pObj.type !== "PlainText")
					return next(new AppError("Primary Name must be of type 'PlainText'", 400));
				pObj.slug = slugify(pObj.name, { lower: true });
				pObj.required = true;
				pObj.editable = true;
			}
			// If no primaryName was set, set default primary name
			else {
				pObj = defaultPrimaryName;
			}
			// Push Primary Name Object into finalized fields array
			fields.push(pObj);

			// Store Collecion Field
			for (const testField of bodyFields) {
				const result = testCollectionValidations(testField);
				if (!result[0]) return next(new AppError(result[1], 400));
				const field = result[1];
				fields.push(
					new CustomCollectionField(
						field.name,
						field.type,
						field.required,
						field.validations,
						field.helpText
					)
				);
			}
		}
		// Push default primary name field
		else {
			fields.push(defaultPrimaryName);
		}
		// Push default collection fields to the end of the fields array
		fields.push(...defaultCollectonFields);
		// CREATE COLLECTION!!!
		const collection = await Collection.create({
			name: req.body.name,
			database: database._id,
			fields,
			slug: req.body.slug,
		});
		// Send Response
		res.status(201).json({
			status: "success",
			collection,
		});
	}
);

export const updateCollection = catchAsync(
	async (req: CustomRequest<CollectionModel>, res: Response, next: NextFunction) => {
		if (!req.body.name) {
			return next(new AppError("Use the 'name' field to change the name of the collection", 400));
		}
		const collection = await Collection.findByIdAndUpdate(
			req.params.collection_id,
			{ name: req.body.name },
			{ new: true }
		);

		if (!collection) {
			return next(new AppError("There is no collection with this ID", 404));
		}

		res.status(200).json({
			status: "success",
			collection,
		});
	}
);

/**
 * Deletes a collected based on collection ID in route parameter
 * @param {CustomRequest<CollectionModel>} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const deleteCollection = catchAsync(
	async (req: CustomRequest<CollectionModel>, res: Response, next: NextFunction) => {
		const collection = await Collection.findByIdAndDelete(req.params.collection_id);

		if (!collection) {
			return next(new AppError("There is no collection with this ID", 404));
		}

		// TODO
		// DELETE items with collection_id

		res.status(200).json({
			status: "success",
			collectionsDeleted: 1,
			//itemsDeleted: number
		});
	}
);

/**
 * Retrieves a collection's fields
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const getCollectionFields = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const collection = await Collection.findById(req.params.collection_id);

		if (!collection) {
			return next(new AppError("There is no collection with this ID", 404));
		}

		res.status(200).json({
			status: "success",
			fields: collection.fields,
		});
	}
);
