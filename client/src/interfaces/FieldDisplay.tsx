import { CollectionFieldType } from "../../../src/interfaces/collectionInterfaces";

export default interface FieldDisplay {
	type: CollectionFieldType;
	slug: string;
	name: string;
	show: boolean;
}
