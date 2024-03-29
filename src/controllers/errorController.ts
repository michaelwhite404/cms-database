import { NextFunction, Request, Response } from "express";
import mongoose, { CastError } from "mongoose";
import { MongoError } from "mongodb";
import AppError from "../utils/appError";
import { arrayCompare } from "../utils/compareArray";

type ValidationError = mongoose.Error.ValidationError;

const handleCastErrorDB = (err: CastError): AppError => {
	let value: string = "";
	if (arrayCompare(Object.keys(err.value), ["_id", "_cid"])) {
		value = err.value._id;
	}
	const message = `Invalid ${err.path}: ${value || err.value}.`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongoError): AppError => {
	let value: string;
	// @ts-ignore
	if (arrayCompare(Object.keys(err.keyValue), ["database", "slug"])) value = err.keyValue.slug;
	// @ts-ignore
	else if (arrayCompare(Object.keys(err.keyValue), ["database", "name"])) value = err.keyValue.name;
	// @ts-ignore
	else if (arrayCompare(Object.keys(err.keyValue), ["_cid", "slug"])) value = err.keyValue.slug;
	else {
		value = err.errmsg!.match(/(["'])(\\?.)*?\1/)![0];
	}

	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new AppError(message, 400);
};
const handleValidationErrorDB = (err: ValidationError): AppError => {
	const errors = Object.values(err.errors).map((el) => el.message);

	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};

const handleJWTError = () => new AppError("Invalid Token. Please log in again!", 401);

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
	// A) API
	if (req.originalUrl.startsWith("/api")) {
		return res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	}

	return res.status(err.statusCode).render("error", {
		title: err.statusCode + " Error",
		message: err.message,
	});
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
	// A) API
	if (req.originalUrl.startsWith("/api")) {
		// A) Operational, trusted error: send message to client
		if (err.isOperational) {
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
		}
		// B) Programming or other unknown error: don't leak error details
		// 1) Log error
		console.error("ERROR 💥", err);
		// 2) Send generic message
		return res.status(500).json({
			title: err.statusCode + " Error",
			message: err.message,
		});
	}

	// B) RENDERED WEBSITE
	// A) Operational, trusted error: send message to client
	if (err.isOperational) {
		return res.status(err.statusCode).render("error", {
			title: err.statusCode + " Error",
			message: err.message,
		});
	}
	// B) Programming or other unknown error: don't leak error details
	// 1) Log error
	console.error("ERROR 💥", err);
	// 2) Send generic message
	return res.status(err.statusCode).render("error", {
		title: "Something went wrong!",
		msg: "Please try again later.",
	});
};

export default (err: AppError, req: Request, res: Response, _: NextFunction) => {
	// console.log(err.stack);

	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = Object.assign(err);
		let appError = <AppError>{ ...error };
		appError.message = err.message;

		if (error.name === "CastError") appError = handleCastErrorDB(error);
		if (error.code === 11000) appError = handleDuplicateFieldsDB(error);
		if (error.name === "ValidationError") appError = handleValidationErrorDB(error);
		if (error.name === "JsonWebTokenError") appError = handleJWTError();

		sendErrorProd(appError, req, res);
	}
};
