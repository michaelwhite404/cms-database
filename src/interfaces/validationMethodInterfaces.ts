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
	ItemRef: () => ReturnedCollectionValidation;
}
