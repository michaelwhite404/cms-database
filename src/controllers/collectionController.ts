import { NextFunction, Response } from "express";
import slugify from "slugify";
import uniqBy from "lodash.uniqby";

import Collection from "../models/collectionModel";
import catchAsync from "../utils/catchAsync";
import { defaultCollectonFields, defaultPrimaryName, defaultSlugName } from "../defaults";
import AppError from "../utils/appError";
import { testCollectionValidations } from "../utils/validations";
import { CustomRequest } from "../interfaces/customRequestInterface";
import { CollectionField, CollectionModel } from "../interfaces/collectionInterfaces";
import APIFeatures from "../utils/APIFeatures";
import Database from "../models/databaseModel";
import { CustomCollectionField } from "../customCollectionField";
import primaryChecker from "../utils/primaryChecker";
import DatabaseRole from "../models/databaseRoleModel";
import DatabaseRoleModel from "../interfaces/databaseRoleInterface";
import pluralize from "pluralize";
import Item from "../models/itemModel";

/**
 * Adds database id from route paramater to request body
 * @param {CustomRequest<CollectionModel>} req Custom Express request object
 * @param {NextFunction} next Express next middleware function
 */
export const setDatabaseId = (
	req: CustomRequest<CollectionModel>,
	_: Response,
	next: NextFunction
): void => {
	if (!req.body.database) req.body.database = req.params.database_id;
	next();
};

/**
 * Throws error if Database ID is not present or the user doesn't have access to the
 * database
 * @param {CustomCollectionRequest<ItemModel, CollectionModel>} req Custom Express request object
 * @param {NextFunction} next Express next middleware function
 */
export const hasDatabaseAccess = catchAsync(
	async (req: CustomRequest<DatabaseRoleModel>, _: Response, next: NextFunction) => {
		if (!req.body.database)
			return next(new AppError("Database ID is required but is not present", 400));
		const databaseRole = await DatabaseRole.findOne({
			database: req.body.database,
			user: req.user!._id,
		});
		if (req.collection && !databaseRole)
			return next(new AppError("There is no collection with this ID", 404));
		if (!databaseRole) return next(new AppError("There is no database with this ID", 404));
		req.databaseRole = databaseRole;
		next();
	}
);

export const getCollectionDatabase = catchAsync(
	async (req: CustomRequest<CollectionModel>, _: Response, next: NextFunction) => {
		if (!req.params.collection_id)
			return next(new AppError("Collection ID is required but is not present", 400));
		const collection = await Collection.findById(req.params.collection_id).select("+database");
		if (!collection) {
			return next(new AppError("There is no collection with this ID", 404));
		}
		req.collection = collection;
		req.body.database = collection.database;
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
		if (req.databaseRole!.role === "viewer")
			return next(new AppError("You are not authorized to perform this action", 403));
		/** Array holding finalized collection fields */
		let fields: Omit<CollectionField, "_id">[] = [];
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
		let bodyFields: any[] = [];
		if (req.body.fields != undefined && req.body.fields.length > 0)
			bodyFields = [...req.body.fields];
		// If there are collection fields in the body
		if (bodyFields.length > 0) {
			// If there are any duplicates, throw error
			if (uniqBy(bodyFields, "name").length < bodyFields.length)
				return next(new AppError("All fields must have diffferent names", 400));

			// Test primary Fields
			// Primary Naame
			let pNameChecker = primaryChecker(bodyFields, "Name");
			if (!pNameChecker[0]) return next(new AppError(pNameChecker[1], 400));
			fields.push(pNameChecker[1]);
			// Primary Slug
			let pSlugChecker = primaryChecker(pNameChecker[2], "Slug");
			if (!pSlugChecker[0]) return next(new AppError(pSlugChecker[1], 400));
			fields.push(pSlugChecker[1]);
			// Get remaining body fields
			bodyFields = pSlugChecker[2];

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
			fields.push(defaultPrimaryName, defaultSlugName);
		}
		// Push default collection fields to the end of the fields array
		fields.push(...defaultCollectonFields);
		// CREATE COLLECTION!!!
		const collection = await Collection.create({
			name: req.body.name,
			database: database._id,
			fields,
			slug: req.body.slug,
			createdBy: req.user!._id,
			createdAt: new Date(Date.now()),
			updatedBy: req.user!._id,
			lastUpdated: new Date(Date.now()),
		});
		// Send Response
		res.status(201).json({
			status: "success",
			collection,
		});
	}
);

export const updateCollection = catchAsync(
	async (req: CustomRequest<CollectionModel>, res: Response) => {
		if (req.body.name) req.body.singularName = pluralize.singular(req.body.name);
		else delete req.body.singularName;
		req.body.updatedBy = req.user!._id as string;
		req.body.lastUpdated = new Date(Date.now());
		delete req.body.fields;
		const collection = await Collection.findByIdAndUpdate(req.params.collection_id, req.body, {
			new: true,
		});

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
	async (req: CustomRequest<CollectionModel>, res: Response) => {
		const [item] = await Promise.all([
			Item.deleteMany({ _cid: req.params.collection_id }),
			Collection.findByIdAndDelete(req.params.collection_id),
		]);

		res.status(200).json({
			status: "success",
			collectionsDeleted: 1,
			itemsDeleted: item.deletedCount,
		});
	}
);
