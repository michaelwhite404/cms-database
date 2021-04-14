import slugify from "slugify";
import validator from "validator";

import { CollectionField } from "../interfaces/collectionInterfaces";

/**
 * Returns whether the field is a reserved name
 * @param {string} name Name of the field
 * @returns {boolean} Whether the field is a reserved name
 */
export const notReservedField = (name: string) => {
  /** Array of reserved slug names */
  const reservedFieldNames = [
    "created-by",
    "updated-by",
    "updated-on",
    "created-on",
  ];
  if (reservedFieldNames.includes(slugify(name, { lower: true }))) return false;
  return true;
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
  field: CollectionField
): [boolean, string] => {
  const missingMessage = (arg: string) =>
    `The argument '${arg}' is required but it is missing`;
  if (value === undefined) return [false, missingMessage("value")];
  if (field === undefined) return [false, missingMessage("field")];

  const messageStart = `The value for '${field.slug}' is`;

  const validations: { [key: string]: Function } = {
    /** Email validation test */
    Email: (): [boolean, string] => {
      if (typeof value !== "string")
        return [false, `${messageStart} not a string value`];
      const result = validator.isEmail(value);
      const message = `${messageStart} ${result ? "" : "not "}a valid email`;
      return [result, message];
    },
    /** Phone validation test */
    Phone: (): [boolean, string] => {
      if (typeof value !== "string")
        return [false, `${messageStart} not a string value`];
      const result = validator.isMobilePhone(value);
      const message = `${messageStart} ${
        result ? "" : "not "
      }a valid phone number`;
      return [result, message];
    },
    /** HEX color test */
    Color: (): [boolean, string] => {
      if (typeof value !== "string")
        return [false, `${messageStart} not a string value`];
      const result = validator.isHexColor(value);
      const message = `${messageStart} ${
        result ? "" : "not "
      }a valid hex color`;
      return [result, message];
    },
    /** Boolean validation test */
    Bool: (): [boolean, string] => {
      const result = typeof value === "boolean";
      const message = `${messageStart} ${result ? "" : "not "}a boolean value`;
      return [result, message];
    },
    /** PlainText validation test */
    PlainText: (): [boolean, string] => {
      if (typeof value !== "string")
        return [false, `${messageStart} not a string value`];
      if (value.length === 0) return [false, `${messageStart} has no value`];
      if (field.validations && Object.keys(field.validations).length > 0) {
        const { maxLength, minLength, pattern } = field.validations;
        // maxLength Validation
        if (typeof maxLength === "number" && value.length > maxLength)
          return [
            false,
            `${messageStart.replace(
              " is",
              ""
            )} must not exceed the max character count of ${maxLength}`,
          ];
        // minLength Validation
        if (typeof minLength === "number" && value.length > minLength)
          return [
            false,
            `${messageStart.replace(
              " is",
              ""
            )} must not exceed the min character count of ${minLength}`,
          ];
        // pattern Validation
        if (pattern instanceof RegExp && value.search(pattern) < 0)
          return [
            false,
            `${messageStart} must be alphanumerical and not contain any spaces or special characters`,
          ];
      }
      return [true, `${messageStart} a valid PlainText input`];
    },
    /** Number validation test */
    Number: (): [boolean, string] => {
      if (typeof value !== "number")
        return [false, `${messageStart} not a number`];
      if (field.validations && Object.keys(field.validations).length > 0) {
        const {
          allowNegative,
          maximum,
          minimum,
          decimalPlaces,
        } = field.validations;
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
          return [
            false,
            `${messageStart} cannot be below the value of ${minimum}`,
          ];
        }
        // (Decimal Places) If the number exceeds the maximum number of decimal places
        const countDecimals = (value: number) => {
          if (Math.floor(value) === value) return 0;
          return value.toString().split(".")[1].length || 0;
        };
        if (
          typeof decimalPlaces === "number" &&
          countDecimals(value) > decimalPlaces
        ) {
          return [
            false,
            `${messageStart} cannot exceed a more than ${decimalPlaces} decimal places`,
          ];
        }
      }
      return [true, `${messageStart} is a valid number`];
    },
    /** Link validation test */
    Link: (): [boolean, string] => {
      if (typeof value !== "string")
        return [false, `${messageStart} not a string value`];
      const result = validator.isURL(value);
      const message = `${messageStart} ${result ? "" : "not "}a valid link`;
      return [result, message];
    },
    Option: (): [boolean, string] => {
      const options = field.validations!.options!;
      /** Does the option chosen by the user exists */
      const result =
        options.filter((option) => value === option.name).length > 0;
      const message = `${messageStart} ${result ? "" : "not "}a valid option`;
      return [result, message];
    },
    // Date: (): [boolean, string] => {

    // }
  };
  return validations[field.type]();
};

// export const testCollectionValidations = (field: CollectionField) => {
//   if () {

//   }
// }
