import { NextFunction, Request, Response } from "express";
import { CookieOptions } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import crypto from "crypto";

import { CustomRequest } from "../interfaces/customRequestInterface";
import { UserModel } from "../interfaces/userInterfaces";
import User from "../models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { DatabaseRoles } from "../interfaces/databaseRoleInterface";
// import DecodedPayload from "../interfaces/decodedPayloadInterface";

const signToken = (id: UserModel["_id"]): string => {
	return jwt.sign({ id }, process.env.JWT_SECRET!, {
		expiresIn: process.env.JWT_EXPIRES_IN!,
	});
};

const createSendToken = (user: UserModel, statusCode: number, res: Response) => {
	const token = signToken(user._id);
	const cookieOptions: CookieOptions = {
		expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN! * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};
	if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

	res.cookie("jwt", token, cookieOptions);

	// Remove password from output
	user.password = (undefined as unknown) as string;

	res.status(statusCode).json({
		status: "success",
		token,
		user,
	});
};

/**
 * Signs up a new user
 * @param {CustomRequest<UserModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const signup = catchAsync(async (req: Request, res: Response) => {
	const newUser = await User.create(req.body);
	createSendToken(newUser, 201, res);
});

/**
 * Logs the user in
 * @param {CustomRequest<UserModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const login = catchAsync(
	async (req: CustomRequest<UserModel>, res: Response, next: NextFunction) => {
		const { email, password } = req.body;
		// 1. Check if email and password exist
		if (!email || !password) {
			return next(new AppError("Please provide email and password", 400));
		}
		// 2. Check if user exists & password is correct
		const user = await User.findOne({ email }).select("+password");

		if (!user || !(await user.correctPassword(password, user.password))) {
			return next(new AppError("Incorrect email or password", 401));
		}

		// 3. If everything is ok, send token to client
		user.lastLogin = new Date();
		await user.save({ validateBeforeSave: false });
		createSendToken(user, 200, res);
	}
);

/**
 * Logs the user out
 * @param {CustomRequest<UserModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const logout = (_: Request, res: Response) => {
	res.cookie("jwt", "loggedout", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: "success" });
};

export const protect = catchAsync(
	async (req: CustomRequest<UserModel>, res: Response, next: NextFunction) => {
		// 1) Getting token and check if it's there
		let token;
		if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1];
		} else if (req.cookies.jwt) {
			token = req.cookies.jwt;
		}

		if (!token) {
			return next(new AppError("You are not logged in", 401));
		}
		// 2.) Verification token
		// @ts-ignore
		const decoded: DecodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET!);

		// console.log(decoded);
		// 3.) Check if user still exists
		const freshUser = await User.findById(decoded.id);
		if (!freshUser) {
			return next(new AppError("The user belonging to this token no longer exists.", 401));
		}
		// 4.) Check if used changed passsword after the token was issued
		if (freshUser.changedPasswordAfter(decoded.iat)) {
			return next(new AppError("User recently changed password. Please log in again!", 401));
		}
		req.user = freshUser;
		res.locals.user = freshUser;
		// GRANT ACCESS TO PROTECTED ROUTE
		next();
	}
);

/**
 * Throws error if the user's database role is not a permitted role
 * @param roles An array of roles that the current user must have to enter the next handler
 */
export const restrictTo = (...roles: DatabaseRoles[]) => {
	return (req: CustomRequest<UserModel>, _: Response, next: NextFunction) => {
		// roles ['editor','viewer']
		if (!roles.includes(req.databaseRole!.role)) {
			return next(new AppError("You do not have permission to perform this action", 403));
		}
		next();
	};
};

/**
 * Creates reset token for forgetten password
 * @param {CustomRequest<UserModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const forgotPassword = catchAsync(
	async (req: CustomRequest<UserModel>, res: Response, next: NextFunction) => {
		// 1.) Get user based on POSTed email
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return next(new AppError("There is no user with this email address", 404));
		}
		// 2.) Generate random token
		const resetToken = user.createPasswordResetToken();
		await user.save({ validateBeforeSave: false });
		// 3. Send it to user's email
		// const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${resetToken}`;

		// const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.
		//                   \nIf you didn't forget your password, please ignore this email!`;

		// try {
		// 	// await sendEmail({
		// 	//   email: user.email,
		// 	//   subject: "Your password reset token (valid for 10 min)",
		// 	//   message,
		// 	// });

		// 	await new Email(user, resetURL).sendPasswordReset();

		// 	res.status(200).json({
		// 		status: "success",
		// 		message: "Token sent to email!",
		// 	});
		// } catch (err) {
		// 	user.createPasswordResetToken = undefined;
		// 	user.createPasswordResetExpires = undefined;
		// 	await user.save({ validateBeforeSave: false });

		// 	return next(new AppError("There was an error sending the email. Try again later!"), 500);
		// }

		res.status(200).json({
			status: "success",
			resetToken,
		});
	}
);

/**
 * Retrieves user from reset token and resets password
 * @param {CustomRequest<UserModel>} req Custom Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next middleware function
 */
export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	// 1) Get user based on the token
	const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: new Date(Date.now()) },
	});

	// 2) If token has not expired, and there is user, set the new password
	if (!user) {
		return next(new AppError("Token is invalid or has expired", 400));
	}

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	// 3) Update passwordChangedAt property for the user
	// Done in pre-hook
	// 4) Log the user in, send JWT
	createSendToken(user, 200, res);
});
