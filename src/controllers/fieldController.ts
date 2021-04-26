import { NextFunction, Response } from "express";
import Collection from "../models/collectionModel";
import { CollectionField, CollectionModel } from "../interfaces/collectionInterfaces";
import { CustomRequest } from "../interfaces/customRequestInterface";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import slugify from "slugify";
import { testCollectionValidations } from "../utils/validations";
import { CustomCollectionField } from "../customCollectionField";

/**
 * Retrieves fields in collection based on collection ID route parameter
 * @param {CustomRequest<CollectionModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const getAllCollectionFields = catchAsync(
	async (req: CustomRequest<CollectionModel>, res: Response) => {
		res.status(200).json({
			status: "success",
			fields: req.collection!.fields,
		});
	}
);

/**
 * Retrieves collection field based on collection ID and field ID route parameters
 * @param {CustomRequest<CollectionModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const getCollectionField = catchAsync(
	async (req: CustomRequest<CollectionField>, res: Response, next: NextFunction) => {
		const field = req.collection!.fields.find(
			(field) => field._id.toString() === req.params.field_id
		);

		if (!field) {
			return next(new AppError("There is no field with this ID", 404));
		}

		res.status(200).json({
			status: "success",
			field,
		});
	}
);

/**
 * Creates a new collection field based on collection ID route parameter
 * @param {CustomRequest<DatabaseModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const createCollectionField = catchAsync(
	async (req: CustomRequest<CollectionField>, res: Response, next: NextFunction) => {
		const pushIndex = req.collection!.fields.length - 4;

		const testResult = testCollectionValidations(req.body as any);
		if (!testResult[0]) return next(new AppError(testResult[1], 400));
		const finalField = new CustomCollectionField(
			testResult[1].name,
			testResult[1].type,
			testResult[1].required,
			testResult[1].validations,
			testResult[1].helpText
		);

		const newCollection = await Collection.findByIdAndUpdate(
			req.params.collection_id,
			{ $push: { fields: { $each: [finalField], $position: pushIndex } } },
			{ new: true }
		);

		res.status(200).json({
			status: "success",
			field: newCollection!.fields[pushIndex],
		});
	}
);

/**
 * Deletes a collection field based on collection ID and field ID route parameters
 * @param {CustomRequest<DatabaseModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const deleteCollectionField = catchAsync(
	async (req: CustomRequest<CollectionModel>, res: Response, next: NextFunction) => {
		await Collection.findByIdAndUpdate(
			req.params.collection_id,
			{
				$pull: {
					fields: {
						_id: req.params.field_id,
						primary: undefined,
						editable: true,
					},
				},
			},
			{ new: false },
			(_, collection) => {
				if (!collection) {
					return next(new AppError("There is no collection with this ID", 404));
				}
				const fieldIndex = collection.fields.findIndex(
					(field) => field._id.toString() === req.params.field_id
				);
				const field = collection.fields[fieldIndex];
				if (!field) {
					return next(new AppError("There is no field with this ID", 404));
				}

				if (fieldIndex < 2 || field.editable === false) {
					return next(new AppError("This field cannot be deleted", 400));
				}
				res.status(200).json({
					status: "success",
					fieldDeleted: true,
				});
			}
		);
	}
);

export const updateCollectionField = catchAsync(
	async (req: CustomRequest<CollectionField>, res: Response, next: NextFunction) => {
		const fieldIndex = req.collection!.fields.findIndex(
			(field) => field._id.toString() === req.params.field_id
		);

		const field = req.collection!.fields[fieldIndex];
		if (!field) {
			return next(new AppError("There is no field with this ID", 404));
		}
		const name = (req.body.name as any) ?? field.name;
		const slug = slugify(name, { lower: true });
		const required = (req.body.required as any) ?? field.required;
		const helpText = (req.body.helpText as any) ?? field.helpText;
		const validations = (req.body.validations as any) ?? field.validations;
		const setField: object = {
			name,
			slug,
			editable: field.editable,
			type: field.type,
			required,
			helpText,
			validations,
		};
		const testResult = testCollectionValidations(setField);
		if (!testResult[0]) return next(new AppError(testResult[1], 400));
		const finalField = new CustomCollectionField(
			testResult[1].name,
			testResult[1].type,
			testResult[1].required,
			testResult[1].validations,
			testResult[1].helpText
		);
		finalField._id = field._id;

		const newCollection = await Collection.findByIdAndUpdate(
			req.params.collection_id,
			{ $set: { [`fields.${fieldIndex}`]: finalField } },
			{ new: true }
		);

		res.status(200).json({
			status: "success",
			field: newCollection!.fields[fieldIndex],
		});
	}
);
