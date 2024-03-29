import { model, Model, Schema, Types } from "mongoose";

import DatabaseRoleModel from "../interfaces/databaseRoleInterface";

const databaseRoleSchema = new Schema({
	user: {
		type: Types.ObjectId,
		ref: "User",
		required: true,
		immutable: true,
	},
	database: {
		type: Types.ObjectId,
		ref: "Database",
		required: true,
		immutable: true,
	},
	role: {
		type: String,
		required: true,
		immutable: false,
		enum: {
			values: ["owner", "editor", "viewer"],
			message: "Database roles can only be 'owner', 'editor' or 'viewer'",
		},
	},
	pinned: {
		type: Boolean,
		required: true,
		immutable: false,
		default: false,
	},
});

databaseRoleSchema.index({ database: 1, user: 1 }, { unique: true });

const DatabaseRole: Model<DatabaseRoleModel> = model<DatabaseRoleModel>(
	"DatabaseRole",
	databaseRoleSchema
);

export default DatabaseRole;
