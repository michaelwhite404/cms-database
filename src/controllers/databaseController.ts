import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/customRequestInterface";
import DatabaseModel from "../interfaces/databaseInterface";
import DatabaseRoleModel from "../interfaces/databaseRoleInterface";
import { UserModel } from "../interfaces/userInterfaces";
import Database from "../models/databaseModel";
import DatabaseRole from "../models/databaseRoleModel";
import User from "../models/userModel";
import APIFeatures from "../utils/APIFeatures";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

/**
 * Retrieves database based on database ID route parameter
 * @param {CustomRequest<DatabaseModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const getDatabase = catchAsync(
	async (req: CustomRequest<DatabaseModel>, res: Response, next: NextFunction) => {
		/** Database returned */
		const database = await Database.findById(req.params.database_id).select("-__v");
		// If no database was found
		if (!database) {
			return next(new AppError("There is no database with this ID", 404));
		}

		res.status(200).json({
			status: "success",
			database,
		});
	}
);

/**
 * Retrieves all databases the user has access to
 * @param {CustomRequest<DatabaseRoleModel>} req Custom Express request object
 * @param {Response} res Express response object
 */
export const getAllDatabases = catchAsync(
	async (req: CustomRequest<DatabaseRoleModel>, res: Response) => {
		const features = new APIFeatures<DatabaseRoleModel>(
			DatabaseRole.find({ user: req.user!._id }).populate({
				path: "database",
				select: "-__v",
			}),
			req.query
		)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		const accessableDatabases = await features.query;

		const databases = accessableDatabases.map(
			(d) => d.database
			// Object.assign({ role: d.role }, d.database._doc)
		);

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
		const database = await Database.create({ name: req.body.name, createdBy: req.user!._id });
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
	async (req: CustomRequest<DatabaseModel>, res: Response, next: NextFunction) => {
		delete req.body.slug;
		const database = await Database.findByIdAndUpdate(req.params.database_id, req.body, {
			new: true,
		});
		if (!database) {
			return next(new AppError("There is no database with this ID", 404));
		}
		await database.save();

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
	async (req: CustomRequest<DatabaseModel>, res: Response, next: NextFunction) => {
		/** The deleted database, if found */
		const database = await Database.findByIdAndDelete(req.params.database_id);
		// If no database is returned, throw error
		if (!database) {
			return next(new AppError("There is no database with this ID", 404));
		}
		// Send response
		res.status(200).json({
			status: "success",
			databasesDeleted: 1,
			// collectionsDeleted: number,
			// itemsDeleted: number
		});
	}
);

export const shareDatabase = catchAsync(
	async (req: CustomRequest<UserModel & DatabaseRoleModel>, res: Response, next: NextFunction) => {
		const email = req.body.email;
		const role = req.body.role;
		// If the user puts in their own email
		if (email === req.user!.email)
			return next(new AppError("You cannot share this database with yourself", 400));
		// If they set someone else as a user
		if (role === "owner") return next(new AppError("You cannot make someone else an owner", 400));
		// Get user and current user's database role
		const [user, databaseRole] = await Promise.all([
			User.findOne({ email }),
			DatabaseRole.findOne({ database: req.params.database_id, user: req.user!._id }),
			// Data
		]);
		// If the user doesn't exist
		if (!user) return next(new AppError("There is no user with this email", 404));
		// If the current user has no access to the database
		if (!databaseRole) return next(new AppError("There is no database with this ID", 404));
		// If the current user is only a viewer
		if (databaseRole.role === "viewer")
			return next(new AppError("You are not authorized to perform this action", 403));
		// If the user already has access to the database
		if (await DatabaseRole.findOne({ database: req.params.database_id, user: user._id }))
			return next(new AppError(`${user.fullName} already has access to this database`, 400));
		await DatabaseRole.create({
			user: user._id,
			database: req.params.database_id,
			role,
		});

		res.status(200).json({
			status: "success",
			message: `${user.fullName} is now a ${role} of this database`,
		});
	}
);
