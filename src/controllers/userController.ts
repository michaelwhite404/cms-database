import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/customRequestInterface";
import { UserModel } from "../interfaces/userInterfaces";
import User from "../models/userModel";
import APIFeatures from "../utils/APIFeatures";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

/**
 * Retrieves all users
 * @param {CustomRequest<UserModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const getAllUsers = catchAsync(async (req: CustomRequest<UserModel>, res: Response) => {
	const features = new APIFeatures(User.find(), req.query).filter().sort().limitFields().paginate();
	const users = await features.query;

	// SEND RESPONSE
	res.status(200).json({
		status: "success",
		results: users.length,
		page: features.page,
		limit: features.limit,
		users,
	});
});

/**
 * Retrieves user based on user ID route parameter
 * @param {CustomRequest<UserModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const getUser = catchAsync(
	async (req: CustomRequest<UserModel>, res: Response, next: NextFunction) => {
		const user = await User.findById(req.params.user_id);

		if (!user) {
			return next(new AppError("No user found with that ID", 404));
		}

		res.status(200).json({
			status: "success",
			user,
		});
	}
);

/**
 * Updates user based on user ID route parameter
 * @param {CustomRequest<UserModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const updateUser = catchAsync(
	async (req: CustomRequest<UserModel>, res: Response, next: NextFunction) => {
		const user = await User.findByIdAndUpdate(req.params.user_id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!user) {
			return next(new AppError("No user found with that ID", 404));
		}

		res.status(200).json({
			status: "success",
			user,
		});
	}
);

/**
 * Deletes user based on user ID route parameters
 * @param {CustomRequest<UserModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const deleteUser = catchAsync(
	async (req: CustomRequest<UserModel>, res: Response, next: NextFunction) => {
		const user = await User.findByIdAndDelete(req.params.user_id);

		if (!user) {
			return next(new AppError("There is no user with this ID", 404));
		}

		res.status(200).json({
			status: "success",
			usersDeleted: 1,
		});
	}
);

/**
 * Adds current user ID as a path parameter to later retrieve the user's info
 * @param {CustomRequest<UserModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const getMe = (req: CustomRequest<UserModel>, res: Response) => {
	const user = (({ _id, email, firstName, lastName }) => ({ _id, email, firstName, lastName }))(
		req.user!
	);
	res.status(200).json({
		status: "success",
		user,
	});
};

export const getUserByEmail = catchAsync(
	async (req: CustomRequest<UserModel>, res: Response, next: NextFunction) => {
		const user = await User.findOne({ email: req.params.email });

		if (!user) {
			return next(new AppError("No user found with that ID", 404));
		}

		res.status(200).json({
			status: "success",
			user: {
				_id: user._id,
				fullName: user.fullName,
				email: user.email,
			},
		});
	}
);
