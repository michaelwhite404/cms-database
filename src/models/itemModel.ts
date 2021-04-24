import { Schema, model, Model, Types } from "mongoose";

import { ItemModel } from "../interfaces/itemInterfaces";

/** Item Schema */
const itemSchema = new Schema(
	{
		slug: {
			type: String,
		},
		_cid: {
			type: Types.ObjectId,
			ref: "Collection",
			required: [true, "An item must be added to a collection"],
			immutable: true,
		},
		database: {
			type: Types.ObjectId,
			ref: "Database",
			required: [true, "An item must be added to a database"],
			immutable: true,
			select: false,
		},
		"created-by": {
			type: String,
			immutable: true,
		},
		"updated-by": {
			type: String,
		},
		"updated-on": {
			type: Date,
			default: () => Date.now(),
			required: true,
		},
		"created-on": {
			type: Date,
			default: () => Date.now(),
			required: true,
			immutable: true,
		},
	},
	{ strict: false }
);

itemSchema.index({ _cid: 1, slug: 1 }, { unique: true });

/** Model for Item Schema */
const Item: Model<ItemModel> = model<ItemModel>("Item", itemSchema);

export default Item;
