import { /* NextFunction, */ Response } from "express";
import { CustomRequest } from "../interfaces/customRequestInterface";
import DatabaseModel from "../interfaces/databaseInterface";
import DatabaseRole from "../models/databaseRoleModel";
import catchAsync from "../utils/catchAsync";

export const dashboardData = catchAsync(
	async (req: CustomRequest<DatabaseModel>, res: Response) => {
		const user = req.user!._id;
		const databaseRoles = await DatabaseRole.find({ user });
		const databaseRoleIds = databaseRoles.map((d) => d.database);
		const renameLater = await DatabaseRole.aggregate([
			{ $match: { database: { $in: databaseRoleIds } } },
			{ $group: { _id: "$database", users: { $push: "$user" } } },
			{
				$lookup: {
					from: "databases",
					localField: "_id",
					foreignField: "_id",
					as: "db",
				},
			},
			{ $unwind: "$db" },
			// { $project: { dbs: 1, _id: 0 } },
			{
				$lookup: {
					from: "users",
					localField: "users",
					foreignField: "_id",
					as: "users",
				},
			},
			{
				$project: {
					name: "$db.name",
					slug: "$db.slug",
					"users.email": 1,
					"users.firstName": 1,
					"users.lastName": 1,
				},
			},
		]);

		res.status(200).json({
			status: "success",
			databases: renameLater,
		});
	}
);
