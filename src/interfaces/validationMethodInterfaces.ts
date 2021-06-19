import { ReturnedCollectionValidation } from "../utils/validations";
import { CollectionFieldType } from "./collectionInterfaces";

export interface CollectionValidationMethods {
	Standard: (type: CollectionFieldType) => Promise<ReturnedCollectionValidation>;
	Email: () => Promise<ReturnedCollectionValidation>;
	Phone: () => Promise<ReturnedCollectionValidation>;
	Color: () => Promise<ReturnedCollectionValidation>;
	File: () => Promise<ReturnedCollectionValidation>;
	ImageRef: () => Promise<ReturnedCollectionValidation>;
	Video: () => Promise<ReturnedCollectionValidation>;
	Bool: () => Promise<ReturnedCollectionValidation>;
	PlainText: () => Promise<ReturnedCollectionValidation>;
	RichText: () => Promise<ReturnedCollectionValidation>;
	Number: () => Promise<ReturnedCollectionValidation>;
	Link: () => Promise<ReturnedCollectionValidation>;
	Option: () => Promise<ReturnedCollectionValidation>;
	Reference: (type: CollectionFieldType) => Promise<ReturnedCollectionValidation>;
	ItemRef: () => Promise<ReturnedCollectionValidation>;
	ItemRefMulti: () => Promise<ReturnedCollectionValidation>;
	Date: () => Promise<ReturnedCollectionValidation>;
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
	Date: () => Promise<[boolean, string, string?]>;
	ImageRef: () => Promise<[boolean, string]>;
	RichText: () => Promise<[boolean, string]>;
	File: () => Promise<[boolean, string]>;
	Video: () => Promise<[boolean, string]>;
	User: () => Promise<[boolean, string]>;
}
