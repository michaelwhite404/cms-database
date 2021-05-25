import { ObjectId } from "mongodb";
import slugify from "slugify";
import {
	CollectionField,
	CollectionFieldType,
	CollectionValidations,
} from "./interfaces/collectionInterfaces";
/**
 * Creates a new collection field
 */
export class CustomCollectionField implements CollectionField {
	_id: ObjectId | string;
	name: string;
	type: CollectionFieldType;
	editable: boolean;
	required: boolean;
	slug: string;
	validations: CollectionValidations<string> | undefined;
	helpText: string | undefined;
	primary: boolean;

	/**
	 *
	 * @param name The name of the collection field
	 * @param type The type of collection field
	 * @param required Shows whether the field is a required field
	 * @param validations Validations an item field must adhere to
	 * @param helpText Human readable text that describes the field
	 * @param primary True if field is a primary field
	 */
	constructor(
		name: string,
		type: CollectionFieldType,
		required: boolean = false,
		validations?: CollectionValidations<string>,
		helpText?: string,
		primary?: boolean
	) {
		this.name = name;
		this.type = type;
		this.slug = slugify(name, { lower: true });
		this.editable = true;
		this.required = required;
		this.validations = validations;
		this.helpText = helpText;
		if (primary) this.primary = true;
	}
}
