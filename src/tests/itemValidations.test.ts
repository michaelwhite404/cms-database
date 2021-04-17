import { CollectionField } from "../interfaces/collectionInterfaces";
import { notReservedField, testItemValidations } from "../utils/validations";

test("Outputs whether the input is a reserved field name", () => {
	expect(notReservedField("Updated By?")).toBe(false);
	expect(notReservedField("updated-by")).toBe(false);
	expect(notReservedField("updated-by   ")).toBe(false);
	expect(notReservedField("updated   by")).toBe(false);
	expect(notReservedField("  updated   by  ")).toBe(false);
	expect(notReservedField("Updated?By")).toBe(true);
	expect(notReservedField("UpdatedBy")).toBe(true);
});

test("Outputs whether the input is a valid email", () => {
	const emailField: CollectionField = {
		_id: "6074820a455d0d04e4c59625",
		name: "Email Address",
		type: "Email",
		validations: {
			singleLine: true,
		},
		editable: true,
		required: true,
		slug: "email",
	};
	expect(testItemValidations("mike@google.com", emailField)[0]).toBe(true);
	expect(testItemValidations("mwhite@google.c", emailField)[0]).toBe(false);
	expect(testItemValidations(".@google.com", emailField)[0]).toBe(false);
	expect(testItemValidations(".@google.com", emailField)[0]).toBe(false);
});

test("Outputs whether the input is a hex color", () => {
	const colorField: CollectionField = {
		_id: "6074820a455d0d04e4c59623",
		name: "Main Color",
		type: "Color",
		slug: "main-color",
		required: false,
		editable: true,
	};
	// Test colors
	expect(testItemValidations("#ffffff", colorField)[0]).toBe(true);
	expect(testItemValidations("#cf1hf3", colorField)[0]).toBe(false);
	expect(testItemValidations("rgb(0, 0, 0)", colorField)[0]).toBe(false);
	expect(testItemValidations("#000001", colorField)[1]).toBe(
		"The value for 'main-color' is a valid hex color"
	);
	expect(testItemValidations("#cb03ez", colorField)[1]).toBe(
		"The value for 'main-color' is not a valid hex color"
	);
});

test("Outputs whether the input is a boolean value", () => {
	const field: CollectionField = {
		required: false,
		editable: true,
		_id: "6074820a455d0d04e4c59624",
		type: "Bool",
		name: "Featured?",
		helpText: "Should this post be featured?",
		slug: "featured",
		order: 2,
	};
	expect(testItemValidations(true, field)[0]).toBe(true);
	expect(testItemValidations(false, field)[0]).toBe(true);
	expect(testItemValidations(0, field)[0]).toBe(false);
	expect(testItemValidations(1, field)[0]).toBe(false);
	expect(testItemValidations("foo", field)[0]).toBe(false);
	expect(testItemValidations({ foo: "bar" }, field)[0]).toBe(false);
	expect(testItemValidations([false], field)[0]).toBe(false);
	expect(testItemValidations(true, field)[1]).toBe("The value for 'featured' is a boolean value");
	expect(testItemValidations(1, field)[1]).toBe("The value for 'featured' is not a boolean value");
});

test("Outputs whether the input is a vaild `PlainText` item with validations", () => {
	expect(
		testItemValidations("Just Plain Text", {
			_id: "6074820a455d0d04e4c59622",
			name: "Text",
			type: "PlainText",
			required: true,
			editable: true,
			validations: { maxLength: 256 },
			slug: "text",
		})[1]
	).toBe("The value for 'text' is a valid PlainText input");
	expect(
		testItemValidations("A".repeat(129), {
			_id: "6074820a455d0d04e4c59622",
			name: "Business Name",
			type: "PlainText",
			required: true,
			editable: true,
			validations: { maxLength: 128 },
			slug: "business-name",
		})[1]
	).toBe("The value for 'business-name' must not exceed the max character count of 128");
	expect(
		testItemValidations("A".repeat(31), {
			_id: "6074820a455d0d04e4c59622",
			name: "Business Name",
			type: "PlainText",
			required: true,
			editable: true,
			validations: { minLength: 32, maxLength: 128 },
			slug: "business-name",
		})[1]
	).toBe("The value for 'business-name' must exceed the min character count of 32");
	expect(
		testItemValidations(23, {
			_id: "607475b2bb86c56568688c50",
			name: "First Name",
			type: "PlainText",
			validations: { maxLength: 256 },
			required: true,
			editable: true,
			slug: "first-name",
		})[1]
	).toBe("The value for 'first-name' is not a string value");
	expect(
		testItemValidations(true, {
			_id: "607475b2bb86c56568688c4f",
			name: "Last Name",
			type: "PlainText",
			validations: { maxLength: 256 },
			required: true,
			editable: true,
			slug: "last-name",
		})[1]
	).toBe("The value for 'last-name' is not a string value");
});

test("Outputs whether the input is a valid Number with validations", () => {
	const numberField: CollectionField = {
		required: false,
		editable: true,
		_id: "6078b07befd4501ab881d389",
		name: "A Number",
		type: "Number",
		slug: "a-number",
		validations: {
			format: "integer",
		},
	};
	expect(testItemValidations(23.56, numberField)[0]).toBe(false);
	expect(testItemValidations(23, numberField)[0]).toBe(true);
	// Don't Allow Negative Numbers
	numberField.validations!.allowNegative = false;
	expect(testItemValidations(-23, numberField)[1]).toBe(
		"The value for 'a-number' cannot be a negative number"
	);
	// Format number as a decimal
	numberField.validations!.format = "decimal";
	// Restrict Decimal Places to 5
	numberField.validations!.decimalPlaces = 5;
	expect(testItemValidations(23.344354, numberField)[1]).toBe(
		"The value for 'a-number' cannot exceed more than 5 decimal places"
	);
	expect(testItemValidations(23.3444, numberField)[0]).toBe(true);
	// Make maximum 100
	numberField.validations!.maximum = 100;
	// Make minimum 50
	numberField.validations!.minimum = 50;
	expect(testItemValidations(152, numberField)[1]).toBe(
		"The value for 'a-number' cannot exceed a value of 100"
	);
	expect(testItemValidations(24, numberField)[1]).toBe(
		"The value for 'a-number' cannot be below the value of 50"
	);
	expect(testItemValidations(72, numberField)[1]).toBe(
		"The value for 'a-number' is a valid number"
	);
});

test("Outputs whether the input is a vaild Link", () => {
	const field: CollectionField = {
		_id: "6078b07befd4501ab881d38c",
		required: false,
		editable: true,
		name: "Evite Link",
		type: "Link",
		slug: "evite-link",
		validations: {
			singleLine: true,
		},
	};
	expect(testItemValidations(23, field)[1]).toBe(
		"The value for 'evite-link' is not a string value"
	);
	expect(testItemValidations("www.if.c", field)[1]).toBe(
		"The value for 'evite-link' is not a valid link"
	);
	expect(testItemValidations("www.espn.com", field)[0]).toBe(true);
	expect(
		testItemValidations("https://spongebob.fandom.com/wiki/Sandy%27s_Nutmare/transcript", field)[0]
	).toBe(true);
	expect(testItemValidations("www.testsite.com?foo=bar#abc", field)[0]).toBe(true);
});

test("Outputs whether the input is a vaild Option", () => {
	const field: CollectionField = {
		required: false,
		editable: true,
		_id: "6078b07befd4501ab881d38b",
		name: "Runners",
		type: "Option",
		slug: "runners",
		validations: {
			options: [
				{
					_id: "6078b07befd4501ab881d38c",
					name: "Mike",
				},
				{
					_id: "6078b07befd4501ab881d392",
					name: "Moe",
				},
				{
					_id: "6078b07befd4501ab881d391",
					name: "Matt",
				},
			],
		},
	};
	expect(testItemValidations("Mike", field)[0]).toBe(true);
	expect(testItemValidations("Miguel", field)[0]).toBe(false);
	expect(testItemValidations("Matt", field)[0]).toBe(true);
});
