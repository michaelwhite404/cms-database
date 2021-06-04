import { NextFunction, Response } from "express";
import a from "indefinite";

import { CustomRequest } from "../interfaces/customRequestInterface";
import DatabaseModel from "../interfaces/databaseInterface";
import DatabaseRoleModel from "../interfaces/databaseRoleInterface";
import { UserModel } from "../interfaces/userInterfaces";
import Database from "../models/databaseModel";
import Collection from "../models/collectionModel";
import DatabaseRole from "../models/databaseRoleModel";
import User from "../models/userModel";
import APIFeatures from "../utils/APIFeatures";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import Item from "../models/itemModel";
import pluralize from "pluralize";
import objectIsEmpty from "../utils/objectIsEmpty";

export const hasAccess = catchAsync(
	async (req: CustomRequest<DatabaseModel>, _: Response, next: NextFunction) => {
		if (req.query.slug) {
			const database = await Database.findOne({ slug: req.params.database_id });
			if (!database) return next(new AppError("There is no database with this ID", 404));
			req.params.database_id = database._id;
		}
		const databaseRole = await DatabaseRole.findOne({
			database: req.params.database_id,
			user: req.user!._id,
		});
		if (!databaseRole) return next(new AppError("There is no database with this ID", 404));
		req.databaseRole = databaseRole;
		next();
	}
);

/**
 * Retrieves database based on database ID route parameter
 * @param {CustomRequest<DatabaseModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const getDatabase = catchAsync(
	async (req: CustomRequest<DatabaseRoleModel>, res: Response) => {
		const database = await Database.findById(req.databaseRole!.database).select("-__v");

		res.status(200).json({
			status: "success",
			database,
		});
	}
);

/**
 * Retrieves all databases the user has access to. Path ending in "/roles" alos adds
 * the roles the user has in each database
 * @param {CustomRequest<DatabaseRoleModel>} req Custom Express request object
 * @param {Response} res Express response object
 */
export const getAllDatabases = catchAsync(
	async (req: CustomRequest<DatabaseModel>, res: Response) => {
		const features = new APIFeatures<DatabaseRoleModel>(
			DatabaseRole.find({ user: req.user!._id }).populate("database", "-__v"),
			req.query
		)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		const resDatabases = await features.query;

		const parseDatabases: DatabaseRoleModel[] = JSON.parse(JSON.stringify(resDatabases));
		const databases = parseDatabases.map((d) => ({
			...(d.database as DatabaseModel),
			role: req.path === "/roles" ? d.role : undefined,
		}));

		res.status(200).json({
			status: "success",
			results: databases.length,
			page: features.page,
			limit: features.limit,
			databases,
		});
	}
);

/**
 * Creates a new database
 * @param {CustomRequest<DatabaseModel>} req Custom Express request object
 * @param {Response} res Express response object
 */
export const createDatabase = catchAsync(
	async (req: CustomRequest<DatabaseModel>, res: Response) => {
		/** Database created */
		const database = await Database.create({
			name: req.body.name,
			description: req.body.description,
			createdBy: req.user!._id,
		});
		await DatabaseRole.create({
			user: req.user!._id,
			database: database._id,
			role: "owner",
		});

		res.status(201).json({
			status: "success",
			database,
		});
	}
);

/**
 * Updates database based on database ID route parameter
 * @param {CustomRequest<DatabaseModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const updateDatabase = catchAsync(
	async (req: CustomRequest<DatabaseModel>, res: Response) => {
		delete req.body.slug;
		const database = await Database.findByIdAndUpdate(req.params.database_id, req.body, {
			new: true,
		});
		await database!.save();

		res.status(200).json({
			status: "success",
			database,
		});
	}
);

/**
 * Retrieves database based on database ID route parameter
 * @param {CustomRequest<DatabaseModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const deleteDatabase = catchAsync(
	async (req: CustomRequest<DatabaseModel>, res: Response) => {
		const database = req.params.database_id;
		const [collections, items] = await Promise.all([
			Collection.deleteMany({ database }),
			Item.deleteMany({ database }),
			Database.findByIdAndDelete(database),
			DatabaseRole.deleteMany({ database }),
		]);

		// Send response
		res.status(200).json({
			status: "success",
			databasesDeleted: 1,
			collectionsDeleted: collections.deletedCount,
			itemsDeleted: items.deletedCount,
		});
	}
);

/**
 * Allows database to be shared based on database ID route parameter
 * @param {CustomRequest<UserModel & DatabaseRoleModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const shareDatabase = catchAsync(
	async (req: CustomRequest<UserModel & DatabaseRoleModel>, res: Response, next: NextFunction) => {
		const { body } = req;
		/** Array of potential shares */
		let potentialShares: any[] = [];
		if (Array.isArray(body)) potentialShares = [...body];
		else if (typeof body === "object" && body !== null) potentialShares.push(body);
		else return next(new AppError("Invalid body", 400));
		if (potentialShares.length === 0 || objectIsEmpty(potentialShares[0]))
			return next(new AppError("No arguments are present", 400));
		/** Array of validated shares */
		const validatedShares: Omit<DatabaseRoleModel, "_id">[] = [];
		let setError = <{ message: string; code: number }>{};
		let singleShareMessage = "";
		// Validate each item

		for (let item of potentialShares) {
			const { email, role } = item;
			// If the user puts in their own email
			if (email === req.user!.email) {
				setError = { message: "You cannot share this database with yourself", code: 400 };
				continue;
			}
			// If they set someone else as a owner
			if (role === "owner") {
				setError = { message: "You cannot make someone else an owner", code: 400 };
				continue;
			}
			if (!["editor", "viewer"].includes(role)) {
				setError = { message: "Role must be 'editor' or 'viewer'", code: 400 };
				continue;
			}
			// Get user and current user's database role
			const [user, databaseRole] = await Promise.all([
				User.findOne({ email }),
				DatabaseRole.findOne({ database: req.params.database_id, user: req.user!._id }),
			]);
			// If the user doesn't exist
			if (!user) {
				setError = { message: "There is no user with this email", code: 404 };
				continue;
			}
			// If the current user has no access to the database
			if (!databaseRole) {
				setError = { message: "There is no database with this ID", code: 404 };
				continue;
			}
			// If the user already has access to the database
			if (await DatabaseRole.findOne({ database: req.params.database_id, user: user._id })) {
				setError = {
					message: `${user.fullName} already has access to this database`,
					code: 400,
				};
				continue;
			}
			const constructedRole = {
				user: user._id,
				database: req.params.database_id,
				role,
				pinned: false,
			};
			validatedShares.push(constructedRole as Omit<DatabaseRoleModel, "_id">);
			singleShareMessage = `${user.fullName} is now ${a(role!)} of this database`;
		}
		if (potentialShares.length === 1 && Object.keys(setError).length > 0)
			return next(new AppError(setError.message, setError.code));
		// @ts-ignore
		const result = await DatabaseRole.insertMany(validatedShares);
		const message =
			body === 1
				? singleShareMessage
				: `${result.length} ${pluralize("user", result.length)} ${pluralize(
						"has",
						result.length
				  )} been added to the database`;

		res.status(200).json({
			status: "success",
			message,
		});
	}
);

// const shareDatabaseWithMany = catchAsync(
// 	async (req: Request, res: Response, next: NextFunction) => {
// const dbRole = await DatabaseRole.insertMany([], { ordered: true });
// 	}
// );
