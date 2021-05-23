import { ReturnedCollectionValidation } from "../utils/validations";
import { CollectionFieldType } from "./collectionInterfaces";

export interface CollectionValidationMethods {
	Standard: (type: CollectionFieldType) => ReturnedCollectionValidation;
	Email: () => ReturnedCollectionValidation;
	Phone: () => ReturnedCollectionValidation;
	Color: () => ReturnedCollectionValidation;
	Bool: () => ReturnedCollectionValidation;
	PlainText: () => ReturnedCollectionValidation;
	Number: () => ReturnedCollectionValidation;
	Link: () => ReturnedCollectionValidation;
	Option: () => ReturnedCollectionValidation;
	Reference: (type: CollectionFieldType) => ReturnedCollectionValidation;
	ItemRef: () => ReturnedCollectionValidation;
	ItemRefMulti: () => ReturnedCollectionValidation;
}

export interface ItemValidationMethods {
	Email: () => Promise<[boolean, string]>;
	Phone: () => Promise<[boolean, string]>;
	Color: () => Promise<[boolean, string]>;
	Bool: () => Promise<[boolean, string]>;
	PlainText: () => Promise<[boolean, string]>;
	Number: () => Promise<[boolean, string]>;
	Link: () => Promise<[boolean, string]>;
	Option: () => Promise<[boolean, string]>;
	ItemRef: () => Promise<[boolean, string]>;
	ItemRefMulti: () => Promise<[boolean, string]>;
	Date: () => Promise<[boolean, string]>;
	ImageRef: () => Promise<[boolean, string]>;
	RichText: () => Promise<[boolean, string]>;
	Video: () => Promise<[boolean, string]>;
	User: () => Promise<[boolean, string]>;
}
