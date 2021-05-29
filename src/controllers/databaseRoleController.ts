import { Response, NextFunction } from "express";
import { CustomRequest } from "../interfaces/customRequestInterface";
import DatabaseRoleModel from "../interfaces/databaseRoleInterface";
import DatabaseRole from "../models/databaseRoleModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const togglePinned = catchAsync(
	async (req: CustomRequest<DatabaseRoleModel>, res: Response, next: NextFunction) => {
		const user = req.user!._id;
		const databaseRole = await DatabaseRole.findOne({ database: req.params.database_id, user });
		if (!databaseRole) return next(new AppError("There is no database with this ID", 404));
		databaseRole.pinned = !databaseRole.pinned;
		await databaseRole.save();

		res.status(200).json({ status: "success", pinned: databaseRole.pinned });
	}
);
