import CollectionData from "../../../src/interfaces/collectionDataInterfaces";

const defaultCollectionData: CollectionData = {
	name: "",
	slug: "",
	pluralName: "Items",
	singularName: "Item",
	fields: [
		{
			name: "Name",
			type: "PlainText",
			required: true,
			primaryName: true,
			validations: { singleLine: true },
		},
		{
			name: "Slug",
			type: "PlainText",
			required: true,
			primarySlug: true,
			validations: { singleLine: true },
		},
	],
};

export default defaultCollectionData;
