import slugify from "slugify";
import validator from "validator";
import a from "indefinite";
import { Types } from "mongoose";
import pluralize from "pluralize";

import {
	CollectionField,
	CollectionFieldType,
	CollectionValidationOption,
	CollectionValidationsKeys,
} from "../interfaces/collectionInterfaces";
import fieldTypes from "../enums/fieldTypes";
import { CollectionValidationMethods } from "../interfaces/validationMethodInterfaces";

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
 * @returns {[boolean, string]} Whether the value passed the vaildation and a message explaining
 * why or why not the value passed
 */
export const testItemValidations = (
	value: any,
	field: CollectionField,
	data?: any
): [boolean, string] => {
	const missingMessage = (arg: string) => `The argument '${arg}' is required but it is missing`;
	if (value === undefined) return [false, missingMessage("value")];
	if (field === undefined) return [false, missingMessage("field")];

	const messageStart = `The value for '${field.slug}'`;

	const validations: { [key: string]: Function } = {
		/** Email validation test */
		Email: (): [boolean, string] => {
			if (typeof value !== "string") return [false, `${messageStart} is not a string value`];
			const result = validator.isEmail(value);
			const message = `${messageStart} is ${result ? "" : "not "}a valid email`;
			return [result, message];
		},
		/** Phone validation test */
		Phone: (): [boolean, string] => {
			if (typeof value !== "string") return [false, `${messageStart} is not a string value`];
			const result = validator.isMobilePhone(value);
			const message = `${messageStart} is ${result ? "" : "not "}a valid phone number`;
			return [result, message];
		},
		/** HEX color test */
		Color: (): [boolean, string] => {
			if (typeof value !== "string") return [false, `${messageStart} is not a string value`];
			const result = validator.isHexColor(value);
			const message = `${messageStart} is ${result ? "" : "not "}a valid hex color`;
			return [result, message];
		},
		/** Boolean validation test */
		Bool: (): [boolean, string] => {
			const result = typeof value === "boolean";
			const message = `${messageStart} is ${result ? "" : "not "}a boolean value`;
			return [result, message];
		},
		/** PlainText validation test */
		PlainText: (): [boolean, string] => {
			if (typeof value !== "string") return [false, `${messageStart} is not a string value`];
			if (value.length === 0) return [false, `${messageStart} has no value`];
			if (field.validations && Object.keys(field.validations).length > 0) {
				const { maxLength, minLength, pattern } = field.validations;
				// maxLength Validation
				if (typeof maxLength === "number" && value.length > maxLength)
					return [false, `${messageStart} must not exceed the max character count of ${maxLength}`];
				// minLength Validation
				if (typeof minLength === "number" && value.length < minLength)
					return [false, `${messageStart} must exceed the min character count of ${minLength}`];
				// pattern Validation
				if (pattern instanceof RegExp && value.search(pattern) < 0)
					return [
						false,
						`${messageStart} must be alphanumerical and not contain any spaces or special characters`,
					];
			}
			return [true, `${messageStart} is a valid PlainText input`];
		},
		/** Number validation test */
		Number: (): [boolean, string] => {
			if (typeof value !== "number") return [false, `${messageStart} is not a number`];
			if (field.validations && Object.keys(field.validations).length > 0) {
				const { allowNegative, maximum, minimum, decimalPlaces, format } = field.validations;
				// (Allow Negative) If the value is is negative and 'allowNegative' is false
				if (allowNegative === false && value < 0) {
					return [false, `${messageStart} cannot be a negative number`];
				}
				// (Maximum) If the value is above the maximum number
				if (typeof maximum === "number" && value > maximum) {
					return [false, `${messageStart} cannot exceed a value of ${maximum}`];
				}
				// (Minimum) If the value is below the minimum number
				if (typeof minimum === "number" && value < minimum) {
					return [false, `${messageStart} cannot be below the value of ${minimum}`];
				}
				// Decimal Places Function
				const countDecimals = (value: number) => {
					if (Math.floor(value) === value) return 0;
					return value.toString().split(".")[1].length || 0;
				};
				// (Decimal Places) If the number exceeds the maximum number of decimal places
				if (typeof decimalPlaces === "number" && countDecimals(value) > decimalPlaces) {
					return [false, `${messageStart} cannot exceed more than ${decimalPlaces} decimal places`];
				}
				// Number format
				if (format === "integer" && countDecimals(value) > 0) {
					return [false, `${messageStart} is not an integer`];
				}
			}
			return [true, `${messageStart} is a valid number`];
		},
		/** Link validation test */
		Link: (): [boolean, string] => {
			if (typeof value !== "string") return [false, `${messageStart} is not a string value`];
			const result = validator.isURL(value);
			const message = `${messageStart} is ${result ? "" : "not "}a valid link`;
			return [result, message];
		},
		Option: (): [boolean, string] => {
			const options = field.validations!.options! as CollectionValidationOption[];
			/** Does the option chosen by the user exists */
			const result = options.filter((option) => value === option.name).length > 0;
			const message = `${messageStart} is ${result ? "" : "not "}a valid option`;
			return [result, message];
		},
		ItemRef: (): [boolean, string] => {
			/** Is the value one of the Item ids */
			const result = typeof data === "object" && data != null;
			const message = `${messageStart} is ${
				result ? "" : "not "
			}an item in the referenced collection`;
			return [result, message];
		},
		ItemRefMulti: (): [boolean, string] => {
			const length = (data as string[]).length;
			const result = length === 0;
			const message = result
				? `${messageStart} is valid`
				: `${messageStart} has ${length} invalid ${pluralize("value", length)}: ${data.join(", ")}`;
			return [result, message];
		},
	};
	return validations[field.type]();
};

export const testCollectionValidations = (
	field: any,
	collectionIds?: string[]
): ReturnedCollectionValidation => {
	// Test Name Property
	if (field === undefined) return [false, "No field was provided"];
	if (field.name === undefined) return [false, "All fields must have a name"];
	if (typeof field.name !== "string") return [false, "Name must be a string"];
	if (!notReservedField(field.name)) return [false, `'${field.name}' is a reserved name.`];
	//Test Type Proerty
	if (field.type === undefined) return [false, "All fields must have a type"];
	if (typeof field.type !== "string") return [false, "Type must be a string"];
	if (!fieldTypes.includes(field.type))
		return [
			false,
			`'${field.type}' is not a valid type. Valid field types include: ${fieldTypes.join(", ")}`,
		];
	if (field.type === "User") return [false, "User cannot set field as type 'User'."];
	// Test helpTest Property
	if (field.helpText && typeof field.helpText !== "string")
		return [false, "'helpText' must be a string"];
	// Test Required Property
	if (field.required && typeof field.required !== "boolean")
		return [false, "'required' must be a boolean"];
	/** Default field if no validations*/
	const defaultField = { ...field, validations: { singleLine: true } } as CollectionField;
	/** The field name */
	const name = field.name!;
	const validations: CollectionValidationMethods = {
		Standard: (type: CollectionFieldType): ReturnedCollectionValidation => {
			if (field.validations) {
				const fieldsPassed = testAllowedFields(type, field.validations, "singleLine");
				if (!fieldsPassed[0]) return fieldsPassed;
				return [true, defaultField];
			}
			return [true, defaultField];
		},
		Email: (): ReturnedCollectionValidation => {
			return validations.Standard("Email");
		},
		Phone: (): ReturnedCollectionValidation => {
			return validations.Standard("Phone");
		},
		Color: (): ReturnedCollectionValidation => {
			return validations.Standard("Color");
		},
		Bool: (): ReturnedCollectionValidation => {
			if (field.validations && Object.keys(field.validations).length > 0)
				return [false, `The field '${field.name}' needs no validations as it is a boolean type`];
			const passedField = field as CollectionField;
			return [true, passedField];
		},
		PlainText: (): ReturnedCollectionValidation => {
			if (field.validations && Object.keys(field.validations).length > 0) {
				const fieldsPassed = testAllowedFields(
					"PlainText",
					field.validations,
					"singleLine",
					"maxLength",
					"minLength"
				);
				if (!fieldsPassed[0]) return fieldsPassed;
				const { maxLength, minLength, singleLine } = field.validations;
				// Max Length must be a number
				const maxLengthTest = typeCheck(maxLength, "maxLength", "number", name);
				if (!maxLengthTest[0]) return maxLengthTest;
				//If maxLength exists but is less than zero
				if (maxLengthTest[1] === "passed" && lessThanZero(maxLength!))
					return [
						false,
						`The validation 'maxLength' cannot be less than zero for the field '${name}'`,
					];
				// Min Length must be a number
				const minLengthTest = typeCheck(minLength, "minLength", "number", name);
				if (!minLengthTest[0]) return minLengthTest;
				// If minLength exists but is less than zero
				if (minLengthTest[1] === "passed" && lessThanZero(minLength!))
					return [
						false,
						`The validation 'minLength' cannot be less than zero for the field '${name}'`,
					];
				// Max Length must be greater than min length
				if (minLength && maxLength && minLength > maxLength) {
					return [
						false,
						`The validation 'minLength' is greater than 'maxLength' for the field '${name}'`,
					];
				}
				// Single Line must be a boolean
				const singleLineTest = typeCheck(singleLine, "singleLine", "boolean", name);
				if (!singleLineTest[0]) return singleLineTest;
				if (singleLineTest[1] === "undefined") field.validations.singleLine = true;
				const passedField = field as CollectionField;
				return [true, passedField];
			}
			// No validations exist
			return [true, defaultField];
		},
		Number: (): ReturnedCollectionValidation => {
			if (field.validations && Object.keys(field.validations).length > 0) {
				if (!field.validations.format)
					return [
						false,
						`The field '${field.name}' must have a 'format' validation. The value can either be 'integer' or 'decimal'.`,
					];
				if (field.validations.format !== "integer" && field.validations.format !== "decimal")
					return [
						false,
						`The validation 'format' value for the field '${field.name}' can only be 'integer' or 'deciamal`,
					];

				const fieldsPassed = testAllowedFields(
					"Number",
					field.validations,
					"format",
					"maximum",
					"minimum",
					"decimalPlaces",
					"allowNegative"
				);
				if (!fieldsPassed[0]) return fieldsPassed;

				const { format, maximum, minimum, allowNegative, decimalPlaces } = field.validations;

				// Maximum must be a number
				const maximumTest = typeCheck(maximum, "maximum", "number", name);
				if (!maximumTest[0]) return maximumTest;
				// Minimum must be a number
				const minimumTest = typeCheck(minimum, "minimum", "number", name);
				if (!minimumTest[0]) return minimumTest;
				// Maximum must be greater than minimum
				if (minimum && maximum && minimum > maximum) {
					return [
						false,
						`The validation 'minimum' is greater than 'maximum' for the field '${name}'`,
					];
				}
				// Allow Negative must be a boolean
				const allowNegativeTest = typeCheck(allowNegative, "allowNegative", "boolean", name);
				if (!allowNegativeTest[0]) return allowNegativeTest;
				// If allow negative is not set, make it false
				if (allowNegativeTest[1] === "undefined") field.validations.allowNegative = false;
				// If allowNegative
				if (
					field.validations.allowNegative === false &&
					((maximum && lessThanZero(maximum)) || (minimum && lessThanZero(minimum)))
				)
					return [
						false,
						`The validations 'minimum' and 'maximum' can only be negative when 'allowNegative' is to true for the field '${field.name}'`,
					];
				// Decimal Places must be a number
				const decimalPlacesTest = typeCheck(decimalPlaces, "decimalPlaces", "number", name);
				if (!decimalPlacesTest[0]) return decimalPlacesTest;
				if (format === "integer" && decimalPlaces && decimalPlaces !== 0)
					return [
						false,
						`The validation 'decimalPlaces' is unnecessary since the format is an integer for the field '${name}'`,
					];
				if (format === "decimal" && decimalPlacesTest[1] === "undefined")
					field.validations.decimalPlaces = 2;
				if (decimalPlacesTest[1] === "passed" && decimalPlaces < 1)
					return [
						false,
						`The validation 'decimalPlaces' cannot be less than 1 for the field '${name}' when the 'format' is a decimal`,
					];
				if (decimalPlacesTest[1] === "passed" && decimalPlaces > 5)
					return [
						false,
						`The validation 'decimalPlaces' cannot be greater than 5 for the field '${name}'`,
					];

				const passedField = field as CollectionField;
				return [true, passedField];
			}
			// If no validations
			const defaultNumberField = {
				...field,
				validations: { format: "decimal", decimalPlaces: 2, allowNegative: false },
			} as CollectionField;
			return [true, defaultNumberField];
		},
		Link: (): ReturnedCollectionValidation => {
			return validations.Standard("Link");
		},
		Option: (): ReturnedCollectionValidation => {
			if (field.validations) {
				const fieldsPassed = testAllowedFields("Option", field.validations, "options");
				if (!fieldsPassed[0]) return fieldsPassed;
				if (!field.validations.options || !Array.isArray(field.validations.options))
					return [
						false,
						`The field '${field.name}' must have an 'options' validation that contains an array of options`,
					];
				const requestOptions = field.validations.options as any[];
				if (requestOptions.length === 0)
					return [false, `The field '${field.name}' has no values in the 'options' array`];
				if (requestOptions.filter((opt) => typeof opt !== "string").length > 0)
					return [
						false,
						`The field '${field.name}' must have an 'options' validation that contains an array of only strings`,
					];
				if (requestOptions.filter((opt) => opt.length > 64).length > 0)
					return [
						false,
						`The field '${field.name}' must only have options that are a maximum of 64 characters`,
					];
				const returnOptions = requestOptions.map((opt) => ({
					_id: new Types.ObjectId(),
					name: opt,
				})) as CollectionValidationOption[];
				field.validations.options = returnOptions;
				const passedField = field as CollectionField;

				return [true, passedField];
			}
			return [
				false,
				`The field '${field.name}' must have an 'options' validation that contains an array of options`,
			];
		},
		Reference: (type: CollectionFieldType): ReturnedCollectionValidation => {
			if (field.validations) {
				const fieldsPassed = testAllowedFields(type, field.validations, "collectionId");
				if (!fieldsPassed[0]) return fieldsPassed;
				if (!field.validations.collectionId)
					return [
						false,
						`The field '${field.name}' must have a 'collectionId' validation of the collection this field is referencing`,
					];
				if (!collectionIds!.includes(field.validations.collectionId)) {
					return [
						false,
						`The validation 'collectionId' is not a collection in this project for the field '${field.name}'`,
					];
				}
				return [true, field];
			}
			return [
				false,
				`The field '${field.name}' must have an 'collectionId' validation of the collection this field is referencing`,
			];
		},
		ItemRef: (): ReturnedCollectionValidation => {
			return validations.Reference("ItemRef");
		},
		ItemRefMulti: (): ReturnedCollectionValidation => {
			return validations.Reference("ItemRefMulti");
		},
	};
	// @ts-ignore
	return validations[field.type]();
};
