import { CustomCollectionField } from "../customCollectionField";
import { CollectionField } from "../interfaces/collectionInterfaces";
import { testCollectionValidations } from "./validations";
import { defaultPrimaryName, defaultSlugName } from "../defaults";

type PrimaryCheckPassed = [true, Omit<CollectionField, "_id">, any[]];
type PrimaryCheckFailed = [false, string];
type PrimaryChecker = PrimaryCheckPassed | PrimaryCheckFailed;
type PrimaryType = "Name" | "Slug";

export default (requestFields: any[], type: PrimaryType): PrimaryChecker => {
	const pTypeIndex: number[] = [];
	let pObj = <Omit<CollectionField, "_id">>{};
	// Store all indexes of objects with the property 'primaryName'
	const primaryType = "primary" + type;
	requestFields.forEach((field, index) => {
		if (field[primaryType] === true) pTypeIndex.push(index);
	});

	// If there is more than 1 object that has the property 'primaryName' as true
	if (pTypeIndex.length > 1) return [false, `You cannot have multiple Primary ${type}s`];
	// If there is only 1 object that has the property 'primaryName' as true
	if (pTypeIndex.length === 1) {
		pObj = requestFields.splice(pTypeIndex[0], 1)[0];
		// If the 'primaryName' is not of type 'PlainText'
		if (pObj.type !== "PlainText") return [false, `Primary ${type} must be of type 'PlainText'`];
		// Validate field
		const validationResult = testCollectionValidations(pObj);
		if (!validationResult[0]) return validationResult;
		const returnedField = validationResult[1];
		const primaryField = new CustomCollectionField(
			returnedField.name,
			returnedField.type,
			true,
			returnedField.validations,
			returnedField.helpText,
			true
		);
		return [true, primaryField, requestFields];
	} else if (type === "Name") {
		return [true, defaultPrimaryName, requestFields];
	}
	return [true, defaultSlugName, requestFields];
};
