import { /* NextFunction, */ Response } from "express";
import { Types } from "mongoose";
import { CustomRequest } from "../interfaces/customRequestInterface";
import DatabaseModel from "../interfaces/databaseInterface";
import DatabaseRole from "../models/databaseRoleModel";
import Item from "../models/itemModel";
import catchAsync from "../utils/catchAsync";

export const getDashboardData = catchAsync(
	async (req: CustomRequest<DatabaseModel>, res: Response) => {
		const user = req.user!._id;
		const databaseRoles = await DatabaseRole.find({ user });
		const databaseRoleIds = databaseRoles.map((d) => d.database);
		const databases = await DatabaseRole.aggregate([
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
		databases.forEach((db) => {
			db.totalUsers = db.users.length;
			const dbObj = databaseRoles.find((d) => d.database.toString() === db._id.toString());
			if (dbObj) {
				db.role = dbObj.role;
				db.pinned = dbObj.pinned;
			}
		});

		res.status(200).json({
			status: "success",
			databases,
		});
	}
);

// api/v1/ui/databases/:database_id
export const getAllProjectData = catchAsync(
	async (req: CustomRequest<DatabaseModel>, res: Response) => {
		const collections = await Item.aggregate([
			{ $match: { database: Types.ObjectId(req.params.database_id) } },
			{ $group: { _id: "$_cid", items: { $push: "$$ROOT" } } },
			{ $project: { collectionId: "$_id", items: 1, _id: 0 } },
		]);
		// const collections = await Item.find({ database: req.params.database_id });

		res.status(200).json({
			status: "success",
			collections,
		});
	}
);
