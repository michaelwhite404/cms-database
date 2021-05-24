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

test("Outputs whether the input is a valid email", async () => {
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
	let res = await testItemValidations("mike@google.com", emailField);
	expect(res[0]).toBe(true);
	res = await testItemValidations("mwhite@google.c", emailField);
	expect(res[0]).toBe(false);
	res = await testItemValidations(".@google.com", emailField);
	expect(res[0]).toBe(false);
	res = await testItemValidations(".@google.com", emailField);
	expect(res[0]).toBe(false);
});

test("Outputs whether the input is a hex color", async () => {
	const colorField: CollectionField = {
		_id: "6074820a455d0d04e4c59623",
		name: "Main Color",
		type: "Color",
		slug: "main-color",
		required: false,
		editable: true,
	};
	// Test colors
	let res = await testItemValidations("#ffffff", colorField);
	expect(res[0]).toBe(true);
	res = await testItemValidations("#cf1hf3", colorField);
	expect(res[0]).toBe(false);
	res = await testItemValidations("rgb(0, 0, 0)", colorField);
	expect(res[0]).toBe(false);
	res = await testItemValidations("#000001", colorField);
	expect(res[1]).toBe("The value for 'main-color' is a valid hex color");
	res = await testItemValidations("#cb03ez", colorField);
	expect(res[1]).toBe("The value for 'main-color' is not a valid hex color");
});

test("Outputs whether the input is a boolean value", async () => {
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
	let res = await testItemValidations(true, field);
	expect(res[0]).toBe(true);
	res = await testItemValidations(false, field);
	expect(res[0]).toBe(true);
	res = await testItemValidations(0, field);
	expect(res[0]).toBe(false);
	res = await testItemValidations(1, field);
	expect(res[0]).toBe(false);
	res = await testItemValidations("foo", field);
	expect(res[0]).toBe(false);
	res = await testItemValidations({ foo: "bar" }, field);
	expect(res[0]).toBe(false);
	res = await testItemValidations([false], field);
	expect(res[0]).toBe(false);
	res = await testItemValidations(true, field);
	expect(res[1]).toBe("The value for 'featured' is a boolean value");
	res = await testItemValidations(1, field);
	expect(res[1]).toBe("The value for 'featured' is not a boolean value");
});

test("Outputs whether the input is a vaild `PlainText` item with validations", async () => {
	let res = await testItemValidations("Just Plain Text", {
		_id: "6074820a455d0d04e4c59622",
		name: "Text",
		type: "PlainText",
		required: true,
		editable: true,
		validations: { maxLength: 256 },
		slug: "text",
	});
	expect(res[1]).toBe("The value for 'text' is a valid PlainText input");
	res = await testItemValidations("A".repeat(129), {
		_id: "6074820a455d0d04e4c59622",
		name: "Business Name",
		type: "PlainText",
		required: true,
		editable: true,
		validations: { maxLength: 128 },
		slug: "business-name",
	});
	expect(res[1]).toBe(
		"The value for 'business-name' must not exceed the max character count of 128"
	);
	res = await testItemValidations("A".repeat(31), {
		_id: "6074820a455d0d04e4c59622",
		name: "Business Name",
		type: "PlainText",
		required: true,
		editable: true,
		validations: { minLength: 32, maxLength: 128 },
		slug: "business-name",
	});
	expect(res[1]).toBe("The value for 'business-name' must exceed the min character count of 32");
	res = await testItemValidations(23, {
		_id: "607475b2bb86c56568688c50",
		name: "First Name",
		type: "PlainText",
		validations: { maxLength: 256 },
		required: true,
		editable: true,
		slug: "first-name",
	});
	expect(res[1]).toBe("The value for 'first-name' is not a string value");
	res = await testItemValidations(true, {
		_id: "607475b2bb86c56568688c4f",
		name: "Last Name",
		type: "PlainText",
		validations: { maxLength: 256 },
		required: true,
		editable: true,
		slug: "last-name",
	});
	expect(res[1]).toBe("The value for 'last-name' is not a string value");
});

test("Outputs whether the input is a valid Number with validations", async () => {
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
	let res = await testItemValidations(23.56, numberField);
	expect(res[0]).toBe(false);
	res = await testItemValidations(23, numberField);
	expect(res[0]).toBe(true);
	// Don't Allow Negative Numbers
	numberField.validations!.allowNegative = false;
	res = await testItemValidations(-23, numberField);
	expect(res[1]).toBe("The value for 'a-number' cannot be a negative number");
	// Format number as a decimal
	numberField.validations!.format = "decimal";
	// Restrict Decimal Places to 5
	numberField.validations!.decimalPlaces = 5;
	res = await testItemValidations(23.344354, numberField);
	expect(res[1]).toBe("The value for 'a-number' cannot exceed more than 5 decimal places");
	res = await testItemValidations(23.3444, numberField);
	expect(res[0]).toBe(true);
	// Make maximum 100
	numberField.validations!.maximum = 100;
	// Make minimum 50
	numberField.validations!.minimum = 50;
	res = await testItemValidations(152, numberField);
	expect(res[1]).toBe("The value for 'a-number' cannot exceed a value of 100");
	res = await testItemValidations(24, numberField);
	expect(res[1]).toBe("The value for 'a-number' cannot be below the value of 50");
	res = await testItemValidations(72, numberField);
	expect(res[1]).toBe("The value for 'a-number' is a valid number");
});

test("Outputs whether the input is a vaild Link", async () => {
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
	let res = await testItemValidations(23, field);
	expect(res[1]).toBe("The value for 'evite-link' is not a string value");
	res = await testItemValidations("www.if.c", field);
	expect(res[1]).toBe("The value for 'evite-link' is not a valid link");
	res = await testItemValidations("www.espn.com", field);
	expect(res[0]).toBe(true);
	res = await testItemValidations(
		"https://spongebob.fandom.com/wiki/Sandy%27s_Nutmare/transcript",
		field
	);
	expect(res[0]).toBe(true);
	res = await testItemValidations("www.testsite.com?foo=bar#abc", field);
	expect(res[0]).toBe(true);
});

test("Outputs whether the input is a vaild Option", async () => {
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
	let res = await testItemValidations("6078b07befd4501ab881d38c", field);
	expect(res[0]).toBe(true);
	res = await testItemValidations("60aba60a87cbe18174be99c4", field);
	expect(res[0]).toBe(false);
	res = await testItemValidations("6078b07befd4501ab881d391", field);
	expect(res[0]).toBe(true);
});
