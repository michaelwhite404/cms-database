import { v4 as uuid } from "uuid";
import CollectionData from "../../../src/interfaces/collectionDataInterfaces";

const defaultCollectionData: CollectionData = {
	name: "",
	slug: "",
	pluralName: "Items",
	singularName: "Item",
	fields: [
		{
			tempId: uuid(),
			name: "Name",
			type: "PlainText",
			required: true,
			primaryName: true,
			validations: { singleLine: true },
		},
		{
			tempId: uuid(),
			name: "Slug",
			type: "PlainText",
			required: true,
			primarySlug: true,
			validations: { singleLine: true },
		},
	],
};

export default defaultCollectionData;
