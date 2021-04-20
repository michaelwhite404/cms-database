import { CollectionField } from "./interfaces/collectionInterfaces";

export const defaultCollectonFields: Omit<CollectionField, "_id">[] = [
	{
		editable: false,
		required: true,
		type: "Date",
		slug: "created-on",
		name: "Created On",
	},
	{
		editable: false,
		required: true,
		type: "Date",
		slug: "updated-on",
		name: "Updated On",
	},
	{
		editable: false,
		required: true,
		type: "User",
		slug: "created-by",
		name: "Created By",
	},
	{
		editable: false,
		required: true,
		type: "User",
		slug: "updated-by",
		name: "Updated By",
	},
];

/** Default Primary Name Object */
export const defaultPrimaryName: Omit<CollectionField, "_id"> = {
	editable: true,
	required: true,
	type: "PlainText",
	slug: "name",
	name: "Name",
	primary: true,
	validations: {
		singleLine: true,
	},
};

/** Default Primary Slug Object */
export const defaultSlugName: Omit<CollectionField, "_id"> = {
	validations: {
		singleLine: true,
		// pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
	},
	editable: true,
	required: true,
	type: "PlainText",
	slug: "slug",
	name: "Slug",
	primary: true,
};
