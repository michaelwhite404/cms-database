import { Schema, model, Model, Types } from "mongoose";
import { nanoid } from "nanoid";
import pluralize from "pluralize";
import slugify from "slugify";

import fieldTypes from "../enums/fieldTypes";
import { CollectionModel } from "../interfaces/collectionInterfaces";

/** Collection Schema */
const collectionSchema = new Schema({
	name: {
		type: String,
		required: [true, "A collection must have a name"],
	},
	singularName: {
		type: String,
	},
	database: {
		type: Types.ObjectId,
		required: [true, "A collection must be added to a database"],
		select: false,
		immutable: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: () => Date.now(),
		immutable: true,
	},
	lastUpdated: {
		type: Date,
		required: true,
		default: () => Date.now(),
	},
	slug: {
		type: String,
	},
	shortId: {
		type: String,
		required: true,
		default: () => nanoid(12),
		immutable: true,
	},
	createdBy: String,
	fields: [
		{
			name: String,
			type: {
				type: String,
				enum: {
					values: fieldTypes,
					message: `Valid field type include: [ ${fieldTypes.join(", ")} ]`,
				},
			},
			slug: {
				type: String,
				required: true,
			},
			required: {
				type: Boolean,
				required: true,
				default: false,
			},
			editable: {
				type: Boolean,
				required: true,
				default: true,
				immutable: true,
			},
			validations: {
				type: Object,
				required: false,
			},
			helpText: {
				type: String,
				required: false,
			},
			order: {
				type: Number,
			},
			primary: {
				type: Boolean,
				required: false,
				select: false,
			},
		},
	],
});

collectionSchema.pre<CollectionModel>("save", function (next) {
	this.singularName = pluralize.singular(this.name);
	if (!this.slug) this.slug = slugify(this.name, { lower: true });
	next();
});

collectionSchema.index({ database: 1, name: 1 }, { unique: true });
collectionSchema.index({ database: 1, slug: 1 }, { unique: true });

/** Model for Collection Schema */
const Collection: Model<CollectionModel> = model<CollectionModel>("Collection", collectionSchema);

export default Collection;
