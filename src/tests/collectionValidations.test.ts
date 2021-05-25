import { ObjectId } from "bson";
import fieldTypes from "../enums/fieldTypes";
import {
	/*  CollectionField ,*/ CollectionField,
	CollectionValidations,
} from "../interfaces/collectionInterfaces";
import { testAllowedFields, testCollectionValidations } from "../utils/validations";

test("Outputs whether all of the validation fields are accepted", () => {
	let validations: CollectionValidations<string> = {};
	expect(testAllowedFields("Option", validations, "options")).toStrictEqual([true, "passed"]);
	validations = { maxLength: 64, minLength: 32, maxSize: 100 };
	expect(
		testAllowedFields("PlainText", validations, "singleLine", "maxLength", "minLength")[1]
	).toBe("The validation 'maxSize' is not valid for a PlainText field");
	expect(testAllowedFields("Phone", validations, "singleLine")[1]).toBe(
		"The validations 'maxLength, minLength, maxSize' are not valid for a Phone field"
	);
});

// TODO Type Check

test("Testing non 'CollectionValidations' fields", async () => {
	let res = await testCollectionValidations(undefined);
	expect(res[1]).toBe("No field was provided");
	res = await testCollectionValidations({});
	expect(res[1]).toBe("All fields must have a name");
	res = await testCollectionValidations({ name: "Email Addy" });
	expect(res[1]).toBe("All fields must have a type");
	res = await testCollectionValidations({ type: "Email" });
	expect(res[1]).toBe("All fields must have a name");
	res = await testCollectionValidations({ name: 23 });
	expect(res[1]).toBe("Name must be a string");
	res = await testCollectionValidations({ name: "City", type: false });
	expect(res[1]).toBe("Type must be a string");
	res = await testCollectionValidations({ name: "Business Name", type: "Text" });
	expect(res[1]).toBe(
		"'Text' is not a valid type. Valid field types include: " + fieldTypes.join(", ")
	);
	res = await testCollectionValidations({ name: "Business Name", type: "User" });
	expect(res[1]).toBe("User cannot set field as type 'User'.");
});

test("Testing valid Collection Field with type 'Email'", async () => {
	expect(
		await testCollectionValidations({
			type: "Email",
			name: "Email Address",
		})
	).toStrictEqual([
		true,
		{
			validations: {
				singleLine: true,
			},
			type: "Email",
			name: "Email Address",
		},
	]);
	expect(
		await testCollectionValidations({
			type: "Email",
			name: "Email Address",
			validations: {
				singleLine: false,
			},
		})
	).toStrictEqual([
		true,
		{
			validations: {
				singleLine: true,
			},
			type: "Email",
			name: "Email Address",
		},
	]);
	expect(
		await testCollectionValidations({
			type: "Email",
			name: "Email Address",
			validations: {
				singleLine: false,
				maxLength: 64,
			},
		})
	).toStrictEqual([false, "The validation 'maxLength' is not valid for an Email field"]);
});

test("Testing valid Collection Field with type 'Phone'", async () => {
	type TempType = { name: string; type: string; validations?: object };
	const field: TempType = { name: "Phone Number", type: "Phone" };
	let res = await testCollectionValidations(field);
	expect(res[1]).toStrictEqual({
		...field,
		validations: { singleLine: true },
	});
	res = await testCollectionValidations({
		...field,
		validations: { singleLine: false },
	});
	expect(res[1]).toStrictEqual({
		...field,
		validations: { singleLine: true },
	});
	field.validations = { minLength: 24, maxLength: 48 };
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validations 'minLength, maxLength' are not valid for a Phone field");
});

test("Testing valid Collection Field with type 'Color'", async () => {
	type TempType = { name: string; type: string; validations?: object };
	const field: TempType = { name: "Background Color", type: "Color" };
	let res = await testCollectionValidations(field);
	expect(res[1]).toStrictEqual({ ...field, validations: { singleLine: true } });
	res = await testCollectionValidations({ ...field, validations: { singleLine: false } });
	expect(res[1]).toStrictEqual({ ...field, validations: { singleLine: true } });
	field.validations = { maxLength: 6 };
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validation 'maxLength' is not valid for a Color field");
});

test("Testing valid Collection Field with type 'Bool'", async () => {
	const field = { name: "Featured?", type: "Bool", validations: {} };
	let res = await testCollectionValidations(field);
	expect(res[0]).toBe(true);
	field.validations = { minimum: 10 };
	expect(await testCollectionValidations(field)).toStrictEqual([
		false,
		"The field 'Featured?' needs no validations as it is a boolean type",
	]);
	const newField = { name: field.name, type: field.type };
	res = await testCollectionValidations(newField);
	expect(res[0]).toBe(true);
});

test("Testing valid Collection Field with type 'PlainText'", async () => {
	type TempType = { name: string; type: string; validations?: { [x: string]: any } };
	const field: TempType = { name: "First Name", type: "PlainText" };
	let res = await testCollectionValidations(field);
	expect(res[1]).toStrictEqual({
		name: "First Name",
		type: "PlainText",
		validations: { singleLine: true },
	});
	res = await testCollectionValidations({ ...field, validations: {} });
	expect(res[1]).toStrictEqual({
		name: "First Name",
		type: "PlainText",
		validations: { singleLine: true },
	});
	field.validations = { minimum: 64, maximum: 256 };
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validations 'minimum, maximum' are not valid for a PlainText field");
	field.validations = { minimum: 64 };
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validation 'minimum' is not valid for a PlainText field");
	field.validations = { minLength: 64, maxLength: 256 };
	res = await testCollectionValidations(field);
	expect((res[1] as CollectionField).validations).toStrictEqual({
		minLength: 64,
		maxLength: 256,
		singleLine: true,
	});
	field.validations.minLength = "sixty-four";
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validation 'minLength' for the field 'First Name' must be a number");
	field.validations.maxLength = "two-hundred sixty-four";
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validation 'maxLength' for the field 'First Name' must be a number");
	field.validations = { singleLine: "i guess" };
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validation 'singleLine' for the field 'First Name' must be a boolean");
	field.validations = { minLength: 37, maxLength: 36 };
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The validation 'minLength' is greater than 'maxLength' for the field 'First Name'"
	);
	field.validations = { minLength: -5, maxLength: 36 };
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The validation 'minLength' cannot be less than zero for the field 'First Name'"
	);
	field.validations = { minLength: 5, maxLength: -5 };
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The validation 'maxLength' cannot be less than zero for the field 'First Name'"
	);
	field.validations = { minLength: 10, maxLength: 100, singleLine: false };
	res = await testCollectionValidations(field);
	expect((res[1] as CollectionField).validations).toStrictEqual(field.validations);
});

test("Testing valid Collection Field with type 'Number'", async () => {
	type TempType = { name: string; type: string; validations?: { [x: string]: any } };
	const field: TempType = { name: "Rating", type: "Number" };
	let res = await testCollectionValidations(field);
	expect((res[1] as CollectionField).validations).toStrictEqual({
		format: "decimal",
		decimalPlaces: 2,
		allowNegative: false,
	});
	field.validations = {};
	res = await testCollectionValidations(field);
	expect((res[1] as CollectionField).validations).toStrictEqual({
		format: "decimal",
		decimalPlaces: 2,
		allowNegative: false,
	});
	field.validations = { allowNegative: false };
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The field 'Rating' must have a 'format' validation. The value can either be 'integer' or 'decimal'."
	);
	field.validations.format = "number";
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The validation 'format' value for the field 'Rating' can only be 'integer' or 'deciamal"
	);
	field.validations = { format: "decimal", negative: true, maximum: 5, minimum: 1, decimals: true };
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validations 'negative, decimals' are not valid for a Number field");
	field.validations = {
		format: "decimal",
		allowNegative: 1,
		maximum: true,
		minimum: false,
		decimalPlaces: true,
	};
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validation 'maximum' for the field 'Rating' must be a number");
	field.validations.maximum = 5;
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validation 'minimum' for the field 'Rating' must be a number");
	field.validations.minimum = 10;
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validation 'minimum' is greater than 'maximum' for the field 'Rating'");
	field.validations.minimum = 1;
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validation 'allowNegative' for the field 'Rating' must be a boolean");
	field.validations.allowNegative = undefined;
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validation 'decimalPlaces' for the field 'Rating' must be a number");
	field.validations.decimalPlaces = 5;
	res = await testCollectionValidations(field);
	expect((res[1] as CollectionField).validations?.allowNegative).toBe(false);
	field.validations.format = "integer";
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The validation 'decimalPlaces' is unnecessary since the format is an integer for the field 'Rating'"
	);
	field.validations.format = "decimal";
	field.validations.decimalPlaces = undefined;
	res = await testCollectionValidations(field);
	expect((res[1] as CollectionField).validations?.decimalPlaces).toBe(2);
	field.validations.decimalPlaces = 0;
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The validation 'decimalPlaces' cannot be less than 1 for the field 'Rating' when the 'format' is a decimal"
	);
	field.validations.decimalPlaces = 10;
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The validation 'decimalPlaces' cannot be greater than 5 for the field 'Rating'"
	);
	field.validations = { maximum: -20, format: "integer" };
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The validations 'minimum' and 'maximum' can only be negative when 'allowNegative' is to true for the field 'Rating'"
	);
});

test("Testing valid Collection Field with type 'Link'", async () => {
	type TempType = { name: string; type: string; validations?: object };
	const field: TempType = { name: "Business URL", type: "Link" };
	let res = await testCollectionValidations(field);
	expect(res[1]).toStrictEqual({
		...field,
		validations: { singleLine: true },
	});
	res = await testCollectionValidations({
		...field,
		validations: { singleLine: false },
	});
	expect(res[1]).toStrictEqual({
		...field,
		validations: { singleLine: true },
	});
	field.validations = { minLength: 24, maxLength: 48 };
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The validations 'minLength, maxLength' are not valid for a Link field");
});

test("Testing valid Collection Field with type 'Option'", async () => {
	type TempType = { name: string; type: string; validations?: { [x: string]: any } };
	const field: TempType = { name: "Sizes", type: "Option" };
	let res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The field 'Sizes' must have an 'options' validation that contains an array of options"
	);
	field.validations = {};
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The field 'Sizes' must have an 'options' validation that contains an array of options"
	);
	field.validations.options = {};
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The field 'Sizes' must have an 'options' validation that contains an array of options"
	);
	field.validations.options = "Mike, Moe";
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The field 'Sizes' must have an 'options' validation that contains an array of options"
	);
	field.validations.options = [];
	res = await testCollectionValidations(field);
	expect(res[1]).toBe("The field 'Sizes' has no values in the 'options' array");
	field.validations.options.push("Mike", 23);
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The field 'Sizes' must have an 'options' validation that contains an array of only strings"
	);
	field.validations.options = ["Aye", "B".repeat(100), "Cee"];
	res = await testCollectionValidations(field);
	expect(res[1]).toBe(
		"The field 'Sizes' must only have options that are a maximum of 64 characters"
	);
	field.validations.options = ["Small", "Medium", "Large"];
	// const arrayShouldBe = [{ name: "Small" }, { name: "Medium" }, { name: "Large" }];
	res = await testCollectionValidations(field);
	(res[1] as CollectionField).validations!.options!.forEach((opt: any) => {
		expect(opt).toEqual(
			expect.objectContaining({
				_id: expect.any(ObjectId),
				name: expect.any(String),
			})
		);
	});
});
