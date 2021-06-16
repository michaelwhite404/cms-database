import slugify from "slugify";
import validator from "validator";
import a from "indefinite";
import { Types } from "mongoose";
import pluralize from "pluralize";

import {
	CollectionField,
	CollectionFieldType,
	CollectionValidationOption,
	CollectionValidations,
	CollectionValidationsKeys,
	DateFormat,
	NumberFormat,
} from "../interfaces/collectionInterfaces";
import fieldTypes from "../enums/fieldTypes";
import {
	CollectionValidationMethods,
	ItemValidationMethods,
} from "../interfaces/validationMethodInterfaces";
import Item from "../models/itemModel";
import Collection from "../models/collectionModel";

type CVFailed = [false, string];
type CVPassed = [true, CollectionField];
export type ReturnedCollectionValidation = CVPassed | CVFailed;

type TCFailed = [false, string];
type TCPassed = [true, "undefined" | "passed"];
type ReturnedTypeCheck = TCFailed | TCPassed;

/**
 * Returns whether the field is a reserved name
 * @param {string} name Name of the field
 * @returns {boolean} Whether the field is a reserved name
 */
export const notReservedField = (name: string) => {
	/** Array of reserved slug names */
	const reservedFieldNames = ["created-by", "updated-by", "updated-on", "created-on"];
	if (reservedFieldNames.includes(slugify(name, { lower: true }))) return false;
	return true;
};

/**
 * Tests the validations against accepted fields
 * @param type The type of collection field
 * @param validations Which validations are being tested
 * @param acceptedField An accepted validation field
 * @param additionalFields Addition accepted validation fields
 * @returns {[boolean, string]} A boolean indicating whether the validations passes, and a
 *    message about the results
 */
export const testAllowedFields = (
	type: CollectionFieldType,
	validations: any,
	acceptedField: CollectionValidationsKeys,
	...additionalFields: CollectionValidationsKeys[]
): [false, string] | [true, "passed"] => {
	// Aceepted fields
	const accept = [acceptedField, ...additionalFields];
	// Invalid fields
	// @ts-ignore
	const invalidFields = Object.keys(validations).filter((x) => !accept.includes(x));
	if (invalidFields.length > 0) {
		const words = invalidFields.length > 1 ? ["s", "are"] : ["", "is"];
		const message = `The validation${words[0]} '${invalidFields.join(", ")}' ${
			words[1]
		} not valid for ${a(type)} field`;
		return [false, message];
	}
	return [true, "passed"];
};

/**
 * Tests if the field has the correct type
 * @param validationField The field being type checked
 * @param validationName The name of the validation
 * @param type The type the field should be
 * @param name The name of the field
 */
const typeCheck = (
	validationField: any,
	validationName: string,
	type: string,
	name: string
): ReturnedTypeCheck => {
	if (validationField === undefined) return [true, "undefined"];
	if (typeof validationField !== type) {
		return [false, `The validation '${validationName}' for the field '${name}' must be a ${type}`];
	}
	return [true, "passed"];
};

/**
 * Tests if the number is less than 0
 * @param number The number being tested
 * @returns {boolean} If the number is less than 0
 */
const lessThanZero = (number: number): boolean => {
	return number < 0;
};

/**
 * Validates the item field value as a valid argument
 * @param {any} value The value of the item field
 * @param {CollectionField} field The collection field being tested against
 * @returns {[boolean, string, any]} Array that shows: whether the value passed the vaildation,
 * a message explaining why or why not the value passed, and a new value if the input value needs
 * to be changed
 */
export const testItemValidations = async (
	value: any,
	field: CollectionField
): Promise<[boolean, string, any?]> => {
	const missingMessage = (arg: string) => `The argument '${arg}' is required but it is missing`;
	if (value === undefined) return [false, missingMessage("value")];
	if (field === undefined) return [false, missingMessage("field")];

	const messageStart = `The value for '${field.slug}'`;

	const validations: ItemValidationMethods = {
		/** Email validation test */
		Email: (): Promise<[boolean, string]> => {
			if (typeof value !== "string")
				return Promise.resolve([false, `${messageStart} is not a string value`]);
			const result = validator.isEmail(value);
			const message = `${messageStart} is ${result ? "" : "not "}a valid email`;
			return Promise.resolve([result, message]);
		},
		/** Phone validation test */
		Phone: (): Promise<[boolean, string]> => {
			if (typeof value !== "string")
				return Promise.resolve([false, `${messageStart} is not a string value`]);
			const result = validator.isMobilePhone(value);
			const message = `${messageStart} is ${result ? "" : "not "}a valid phone number`;
			return Promise.resolve([result, message]);
		},
		/** HEX color test */
		Color: (): Promise<[boolean, string]> => {
			if (typeof value !== "string")
				return Promise.resolve([false, `${messageStart} is not a string value`]);
			const result = validator.isHexColor(value);
			const message = `${messageStart} is ${result ? "" : "not "}a valid hex color`;
			return Promise.resolve([result, message]);
		},
		/** Boolean validation test */
		Bool: (): Promise<[boolean, string]> => {
			const result = typeof value === "boolean";
			const message = `${messageStart} is ${result ? "" : "not "}a boolean value`;
			return Promise.resolve([result, message]);
		},
		/** PlainText validation test */
		PlainText: (): Promise<[boolean, string]> => {
			if (typeof value !== "string")
				return Promise.resolve([false, `${messageStart} is not a string value`]);
			if (value.length === 0) return Promise.resolve([false, `${messageStart} has no value`]);
			if (field.validations && Object.keys(field.validations).length > 0) {
				const { maxLength, minLength, pattern } = field.validations;
				// maxLength Validation
				if (typeof maxLength === "number" && value.length > maxLength)
					return Promise.resolve([
						false,
						`${messageStart} must not exceed the max character count of ${maxLength}`,
					]);
				// minLength Validation
				if (typeof minLength === "number" && value.length < minLength)
					return Promise.resolve([
						false,
						`${messageStart} must exceed the min character count of ${minLength}`,
					]);
				// pattern Validation
				if (pattern instanceof RegExp && value.search(pattern) < 0)
					return Promise.resolve([
						false,
						`${messageStart} must be alphanumerical and not contain any spaces or special characters`,
					]);
			}
			return Promise.resolve([true, `${messageStart} is a valid PlainText input`]);
		},
		/** Number validation test */
		Number: (): Promise<[boolean, string]> => {
			if (typeof value !== "number")
				return Promise.resolve([false, `${messageStart} is not a number`]);
			if (field.validations && Object.keys(field.validations).length > 0) {
				const { allowNegative, maximum, minimum, decimalPlaces, format } = field.validations;
				// (Allow Negative) If the value is is negative and 'allowNegative' is false
				if (allowNegative === false && value < 0) {
					return Promise.resolve([false, `${messageStart} cannot be a negative number`]);
				}
				// (Maximum) If the value is above the maximum number
				if (typeof maximum === "number" && value > maximum) {
					return Promise.resolve([false, `${messageStart} cannot exceed a value of ${maximum}`]);
				}
				// (Minimum) If the value is below the minimum number
				if (typeof minimum === "number" && value < minimum) {
					return Promise.resolve([
						false,
						`${messageStart} cannot be below the value of ${minimum}`,
					]);
				}
				// Decimal Places Function
				const countDecimals = (value: number) => {
					if (Math.floor(value) === value) return 0;
					return value.toString().split(".")[1].length || 0;
				};
				// (Decimal Places) If the number exceeds the maximum number of decimal places
				if (typeof decimalPlaces === "number" && countDecimals(value) > decimalPlaces) {
					return Promise.resolve([
						false,
						`${messageStart} cannot exceed more than ${decimalPlaces} decimal places`,
					]);
				}
				// Number format
				if (format === "integer" && countDecimals(value) > 0) {
					return Promise.resolve([false, `${messageStart} is not an integer`]);
				}
			}
			return Promise.resolve([true, `${messageStart} is a valid number`]);
		},
		/** Link validation test */
		Link: (): Promise<[boolean, string]> => {
			if (typeof value !== "string")
				return Promise.resolve([false, `${messageStart} is not a string value`]);
			const result = validator.isURL(value);
			const message = `${messageStart} is ${result ? "" : "not "}a valid link`;
			return Promise.resolve([result, message]);
		},
		Option: (): Promise<[boolean, string]> => {
			const options = field.validations!.options! as CollectionValidationOption[];
			/** Does the option chosen by the user exists */
			const result = options.filter((option) => value === option._id.toString()).length > 0;
			const message = `${messageStart} is ${result ? "" : "not "}a valid option`;
			return Promise.resolve([result, message]);
		},
		ItemRef: async (): Promise<[boolean, string]> => {
			const item = await Item.findOne({
				_cid: field.validations!.collectionId!,
				_id: value,
			});
			/** Is the value one of the Item ids */
			const result = typeof item === "object" && item != null;
			const message = `${messageStart} is ${
				result ? "" : "not "
			}an item in the referenced collection`;
			return Promise.resolve([result, message]);
		},
		ItemRefMulti: async (): Promise<[boolean, string]> => {
			// Receive array of ids from user
			if (!Array.isArray(value)) return Promise.resolve([false, `${messageStart} is not an array`]);
			// Get items from referenced collection that match the ids
			const returnedItems = await Item.find({
				_id: { $in: value },
				_cid: field.validations!.collectionId!,
			});
			// Map only _ids from recieved collection
			const returnedItemsIds = returnedItems.map((i) => i._id.toString());
			// Filter user ids that are not in mapped array
			const notValidIds = value.filter((i) => !returnedItemsIds.includes(i));
			const length = (notValidIds as string[]).length;
			const result = length === 0;
			const message = result
				? `${messageStart} is valid`
				: `${messageStart} has ${length} invalid ${pluralize("value", length)}: ${notValidIds.join(
						", "
				  )}`;
			return Promise.resolve([result, message]);
		},
		Date: (): Promise<[boolean, string, string?]> => {
			const date = new Date(value);
			if (date.toString() === "Invalid Date")
				return Promise.resolve([false, `${messageStart} is not a valid Date`]);
			return Promise.resolve([true, `${messageStart} is a valid Date`, date.toISOString()]);
		},
		ImageRef: (): Promise<[boolean, string]> => {
			return Promise.resolve([false, "Not Implemented"]);
		},
		RichText: (): Promise<[boolean, string]> => {
			return Promise.resolve([false, "Not Implemented"]);
		},
		Video: (): Promise<[boolean, string]> => {
			return Promise.resolve([false, "Not Implemented"]);
		},
		User: (): Promise<[boolean, string]> => {
			return Promise.resolve([false, "Not Implemented"]);
		},
	};
	return await validations[field.type]();
};

export const testCollectionValidations = async (
	field: any,
	database?: string
): Promise<ReturnedCollectionValidation> => {
	// Test Name Property
	if (typeof field !== "object" || field === null)
		return Promise.resolve([false, "No field was provided"]);
	if (field.name === undefined) return Promise.resolve([false, "All fields must have a name"]);
	if (typeof field.name !== "string") return Promise.resolve([false, "Name must be a string"]);
	if (!notReservedField(field.name))
		return Promise.resolve([false, `'${field.name}' is a reserved name.`]);
	//Test Type Proerty
	if (field.type === undefined) return Promise.resolve([false, "All fields must have a type"]);
	if (typeof field.type !== "string") return Promise.resolve([false, "Type must be a string"]);
	if (!fieldTypes.includes(field.type))
		return Promise.resolve([
			false,
			`'${field.type}' is not a valid type. Valid field types include: ${fieldTypes.join(", ")}`,
		]);
	if (field.type === "User")
		return Promise.resolve([false, "User cannot set field as type 'User'."]);
	// Test helpTest Property
	if (field.helpText && typeof field.helpText !== "string")
		return Promise.resolve([false, "'helpText' must be a string"]);
	// Test Required Property
	if (field.required && typeof field.required !== "boolean")
		return Promise.resolve([false, "'required' must be a boolean"]);
	/** Default field if no validations*/
	const defaultField = { ...field, validations: { singleLine: true } } as CollectionField;
	/** The field name */
	const name = field.name!;
	const validations: CollectionValidationMethods = {
		Standard: (type: CollectionFieldType): Promise<ReturnedCollectionValidation> => {
			if (field.validations) {
				const fieldsPassed = testAllowedFields(type, field.validations, "singleLine");
				if (!fieldsPassed[0]) return Promise.resolve(fieldsPassed);
				return Promise.resolve([true, defaultField]);
			}
			return Promise.resolve([true, defaultField]);
		},
		Email: (): Promise<ReturnedCollectionValidation> => {
			return validations.Standard("Email");
		},
		Phone: (): Promise<ReturnedCollectionValidation> => {
			return validations.Standard("Phone");
		},
		Color: (): Promise<ReturnedCollectionValidation> => {
			return validations.Standard("Color");
		},
		Bool: (): Promise<ReturnedCollectionValidation> => {
			if (field.validations && Object.keys(field.validations).length > 0)
				return Promise.resolve([
					false,
					`The field '${field.name}' needs no validations as it is a boolean type`,
				]);
			const passedField = field as CollectionField;
			return Promise.resolve([true, passedField]);
		},
		PlainText: (): Promise<ReturnedCollectionValidation> => {
			if (field.validations && Object.keys(field.validations).length > 0) {
				const fieldsPassed = testAllowedFields(
					"PlainText",
					field.validations,
					"singleLine",
					"maxLength",
					"minLength"
				);
				if (!fieldsPassed[0]) return Promise.resolve(fieldsPassed);
				const { maxLength, minLength, singleLine } = field.validations;
				// Max Length must be a number
				const maxLengthTest = typeCheck(maxLength, "maxLength", "number", name);
				if (!maxLengthTest[0]) return Promise.resolve(maxLengthTest);
				//If maxLength exists but is less than zero
				if (maxLengthTest[1] === "passed" && maxLength! < 1)
					return Promise.resolve([
						false,
						`The validation 'maxLength' cannot be less than one for the field '${name}'`,
					]);
				// Min Length must be a number
				const minLengthTest = typeCheck(minLength, "minLength", "number", name);
				if (!minLengthTest[0]) return Promise.resolve(minLengthTest);
				// If minLength exists but is less than zero
				if (minLengthTest[1] === "passed" && lessThanZero(minLength!))
					return Promise.resolve([
						false,
						`The validation 'minLength' cannot be less than zero for the field '${name}'`,
					]);
				// Max Length must be greater than min length
				if (minLength && maxLength && minLength > maxLength) {
					return Promise.resolve([
						false,
						`The validation 'minLength' is greater than 'maxLength' for the field '${name}'`,
					]);
				}
				// Single Line must be a boolean
				const singleLineTest = typeCheck(singleLine, "singleLine", "boolean", name);
				if (!singleLineTest[0]) return Promise.resolve(singleLineTest);
				if (singleLineTest[1] === "undefined") field.validations.singleLine = true;
				const passedField = field as CollectionField;
				return Promise.resolve([true, passedField]);
			}
			// No validations exist
			return Promise.resolve([true, defaultField]);
		},
		Number: (): Promise<ReturnedCollectionValidation> => {
			if (field.validations && Object.keys(field.validations).length > 0) {
				if (!field.validations.format)
					return Promise.resolve([
						false,
						`The field '${field.name}' must have a 'format' validation. The value can either be 'integer' or 'decimal'.`,
					]);
				if (field.validations.format !== "integer" && field.validations.format !== "decimal")
					return Promise.resolve([
						false,
						`The validation 'format' value for the field '${field.name}' can only be 'integer' or 'decimal'.`,
					]);

				const fieldsPassed = testAllowedFields(
					"Number",
					field.validations,
					"format",
					"maximum",
					"minimum",
					"decimalPlaces",
					"allowNegative"
				);
				if (!fieldsPassed[0]) return Promise.resolve(fieldsPassed);

				const { format, maximum, minimum, allowNegative, decimalPlaces } = field.validations;

				// Maximum must be a number
				const maximumTest = typeCheck(maximum, "maximum", "number", name);
				if (!maximumTest[0]) return Promise.resolve(maximumTest);
				// Minimum must be a number
				const minimumTest = typeCheck(minimum, "minimum", "number", name);
				if (!minimumTest[0]) return Promise.resolve(minimumTest);
				// Maximum must be greater than minimum
				if (minimum && maximum && minimum > maximum) {
					return Promise.resolve([
						false,
						`The validation 'minimum' is greater than 'maximum' for the field '${name}'`,
					]);
				}
				// Allow Negative must be a boolean
				const allowNegativeTest = typeCheck(allowNegative, "allowNegative", "boolean", name);
				if (!allowNegativeTest[0]) return Promise.resolve(allowNegativeTest);
				// If allow negative is not set, make it false
				if (allowNegativeTest[1] === "undefined") field.validations.allowNegative = false;
				// If allowNegative
				if (
					field.validations.allowNegative === false &&
					((maximum && lessThanZero(maximum)) || (minimum && lessThanZero(minimum)))
				)
					return Promise.resolve([
						false,
						`The validations 'minimum' and 'maximum' can only be negative when 'allowNegative' is to true for the field '${field.name}'`,
					]);
				// Decimal Places must be a number
				const decimalPlacesTest = typeCheck(decimalPlaces, "decimalPlaces", "number", name);
				if (!decimalPlacesTest[0]) return Promise.resolve(decimalPlacesTest);
				if (format === "integer" && decimalPlaces && decimalPlaces !== 0)
					return Promise.resolve([
						false,
						`The validation 'decimalPlaces' is unnecessary since the format is an integer for the field '${name}'`,
					]);
				if (format === "decimal" && decimalPlacesTest[1] === "undefined")
					field.validations.decimalPlaces = 2;
				if (decimalPlacesTest[1] === "passed" && decimalPlaces < 1)
					return Promise.resolve([
						false,
						`The validation 'decimalPlaces' cannot be less than 1 for the field '${name}' when the 'format' is a decimal`,
					]);
				if (decimalPlacesTest[1] === "passed" && decimalPlaces > 5)
					return Promise.resolve([
						false,
						`The validation 'decimalPlaces' cannot be greater than 5 for the field '${name}'`,
					]);

				const passedField = field as CollectionField;
				return Promise.resolve([true, passedField]);
			}
			// If no validations
			const defaultNumberField = {
				...field,
				validations: {
					format: "decimal",
					decimalPlaces: 2,
					allowNegative: false,
				} as CollectionValidations<NumberFormat>,
			} as CollectionField;
			return Promise.resolve([true, defaultNumberField]);
		},
		Link: (): Promise<ReturnedCollectionValidation> => {
			return validations.Standard("Link");
		},
		Option: (): Promise<ReturnedCollectionValidation> => {
			if (field.validations) {
				const fieldsPassed = testAllowedFields("Option", field.validations, "options");
				if (!fieldsPassed[0]) return Promise.resolve(fieldsPassed);
				if (!field.validations.options || !Array.isArray(field.validations.options))
					return Promise.resolve([
						false,
						`The field '${field.name}' must have an 'options' validation that contains an array of options`,
					]);
				const requestOptions = field.validations.options as any[];
				if (requestOptions.length === 0)
					return Promise.resolve([
						false,
						`The field '${field.name}' has no values in the 'options' array`,
					]);
				if (requestOptions.filter((opt) => typeof opt !== "string").length > 0)
					return Promise.resolve([
						false,
						`The field '${field.name}' must have an 'options' validation that contains an array of only strings`,
					]);
				if (requestOptions.filter((opt) => opt.length > 64).length > 0)
					return Promise.resolve([
						false,
						`The field '${field.name}' must only have options that are a maximum of 64 characters`,
					]);
				const returnOptions = requestOptions.map((opt) => ({
					_id: new Types.ObjectId(),
					name: opt,
				})) as CollectionValidationOption[];
				field.validations.options = returnOptions;
				const passedField = field as CollectionField;

				return Promise.resolve([true, passedField]);
			}
			return Promise.resolve([
				false,
				`The field '${field.name}' must have an 'options' validation that contains an array of options`,
			]);
		},
		Reference: async (type: CollectionFieldType): Promise<ReturnedCollectionValidation> => {
			if (field.validations) {
				const fieldsPassed = testAllowedFields(type, field.validations, "collectionId");
				if (!fieldsPassed[0]) return Promise.resolve(fieldsPassed);
				if (!field.validations.collectionId)
					return Promise.resolve([
						false,
						`The field '${field.name}' must have a 'collectionId' validation of the collection this field is referencing`,
					]);
				// See if collection is in database
				const collection = await Collection.findOne({
					_id: field.validations.collectionId,
					database,
				}).lean();
				if (!collection) {
					return Promise.resolve([
						false,
						`The validation 'collectionId' is not a collection in this project for the field '${field.name}'`,
					]);
				}
				return Promise.resolve([true, field]);
			}
			return Promise.resolve([
				false,
				`The field '${field.name}' must have an 'collectionId' validation of the collection this field is referencing`,
			]);
		},
		ItemRef: (): Promise<ReturnedCollectionValidation> => {
			return validations.Reference("ItemRef");
		},
		ItemRefMulti: (): Promise<ReturnedCollectionValidation> => {
			return validations.Reference("ItemRefMulti");
		},
		Date: (): Promise<ReturnedCollectionValidation> => {
			if (field.validations && Object.keys(field.validations).length > 0) {
				const fieldsPassed = testAllowedFields("Date", field.validations, "format");
				if (!fieldsPassed[0]) return Promise.resolve(fieldsPassed);
				if (field?.validations?.format) {
					const { format } = field.validations;
					if (format !== "date" && format !== "date-time") {
						return Promise.resolve([
							false,
							`The validation 'format' value for the field '${field.name}' can only be 'date' or 'date-time`,
						]);
					}
					return Promise.resolve([true, field]);
				}
			}
			const defaultDateField = {
				...field,
				validations: {
					format: "date",
				} as CollectionValidations<DateFormat>,
			} as CollectionField;
			return Promise.resolve([true, defaultDateField]);
		},
	};
	// @ts-ignore
	return validations[field.type]();
};
