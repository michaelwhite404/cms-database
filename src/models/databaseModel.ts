import { model, Model, Schema, Types } from "mongoose";
import { nanoid } from "nanoid";
import slugify from "slugify";

import DatabaseModel from "../interfaces/databaseInterface";

const databaseSchema = new Schema({
	name: {
		type: String,
		required: [true, "Each database must have a name"],
	},
	createdBy: {
		type: Types.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: () => Date.now(),
		immutable: true,
	},
	slug: {
		type: String,
		unique: true,
	},
	timezone: {
		type: String,
		required: true,
		default: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
		immutable: true,
	},
});

databaseSchema.pre<DatabaseModel>("save", function (next) {
	if (this.isNew) {
		this.createdAt = new Date(Date.now());
		this.slug = slugify(this.name, { lower: true }) + "_" + nanoid(12);
	} else {
		const shortId = this.slug.split("_")[1];
		this.slug = slugify(this.name, { lower: true }) + "_" + shortId;
	}
	next();
});

const Database: Model<DatabaseModel> = model<DatabaseModel>("Database", databaseSchema);

export default Database;
