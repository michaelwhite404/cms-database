const { default: slugify } = require("slugify");
const { default: validator } = require("validator");

exports.notReservedField = (name) => {
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
 * Validates each field as valid inputs
 * @param {any} item
 * @param {{type: String, validations: {}, slug: String}} field
 * @returns {[Boolean, string]}
 */
exports.testItemValidations = (item, field) => {
  const missingMessage = (arg) =>
    `The argument '${arg}' is required but it is missing`;
  if (item === undefined) return [false, missingMessage("item")];
  if (field === undefined) return [false, missingMessage("field")];

  const messageStart = `The value for '${field.slug}' is`;

  const validations = {
    Email: () => {
      const result = validator.isEmail(item);
      const message = `${messageStart} ${result ? "" : "not "}a valid email`;
      return [result, message];
    },
    Phone: () => {
      const result = validator.isMobilePhone(item);
      const message = `${messageStart} ${
        result ? "" : "not "
      }a valid phone number`;
      return [result, message];
    },
    Color: () => {
      const result = validator.isHexColor(item);
      const message = `${messageStart} ${
        result ? "" : "not "
      }a valid hex color`;
      return [result, message];
    },
    Bool: () => {
      const result = typeof item === "boolean";
      const message = `${messageStart} ${result ? "" : "not "}a boolean value`;
      return [result, message];
    },
    PlainText: () => {
      if (typeof item !== "string")
        return [false, `${messageStart} not a string value`];
      // maxLength Validation
      if (
        field.validations &&
        "maxLength" in field.validations &&
        item.length > field.validations.maxLength
      )
        return [
          false,
          `${messageStart.replace(
            " is",
            ""
          )} must not exceed the max character count of ${
            field.validations.maxLength
          }`,
        ];
      // pattern Validation
      if (
        field.validations &&
        "pattern" in field.validations &&
        item.search(field.validations.pattern) < 0
      )
        return [
          false,
          `${messageStart} must be alphanumerical and not contain any spaces or special characters`,
        ];
      return [true, `${messageStart} a valid PlainText input`];
    },
    Number: () => {
      if (typeof item !== "number")
        return [false, `${messageStart} not a number`];
      if (field.validations && field.validations.length > 0) {
        const { allowNegative, maximum } = field.validations;
        if (allowNegative === false && item < 0) {
          return [false, `${messageStart} cannot be a negative number`];
        }
      }
    },
  };

  return validations[field.type]();
};
