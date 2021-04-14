const { notReservedField, testItemValidations } = require("./validations");

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
  const emailField = {
    type: "Email",
    validations: {
      singleLine: true,
    },
    required: true,
    slug: "email",
  };
  expect(testItemValidations("mike@google.com", emailField)[0]).toBe(true);
  expect(testItemValidations("mwhite@google.c", emailField)[0]).toBe(false);
  expect(testItemValidations(".@google.com", emailField)[0]).toBe(false);
  expect(testItemValidations(".@google.com", emailField)[0]).toBe(false);
});

test("Outputs whether the input is a hex color", () => {
  const colorField = { type: "Color", slug: "color" };
  // Test colors
  expect(testItemValidations("#ffffff", colorField)[0]).toBe(true);
  expect(testItemValidations("#cf1hf3", colorField)[0]).toBe(false);
  expect(testItemValidations("rgb(0, 0, 0)", colorField)[0]).toBe(false);
  expect(testItemValidations("#000001", colorField)[1]).toBe(
    "The value for 'color' is a valid hex color"
  );
  expect(testItemValidations("#cb03ez", colorField)[1]).toBe(
    "The value for 'color' is not a valid hex color"
  );
});

test("Outputs whether the input is a boolean value", () => {
  const field = { type: "Bool", slug: "featured" };
  expect(testItemValidations(true, field)[0]).toBe(true);
  expect(testItemValidations(false, field)[0]).toBe(true);
  expect(testItemValidations(0, field)[0]).toBe(false);
  expect(testItemValidations(1, field)[0]).toBe(false);
  expect(testItemValidations("foo", field)[0]).toBe(false);
  expect(testItemValidations({ foo: "bar" }, field)[0]).toBe(false);
  expect(testItemValidations([false], field)[0]).toBe(false);
  expect(testItemValidations(true, field)[1]).toBe(
    "The value for 'featured' is a boolean value"
  );
  expect(testItemValidations(1, field)[1]).toBe(
    "The value for 'featured' is not a boolean value"
  );
});

test("Outputs whether the input is a vaild `PlainText` item with validations", () => {
  expect(
    testItemValidations("Just Plain Text", {
      type: "PlainText",
      validations: { maxLength: 256 },
      slug: "text",
    })[1]
  ).toBe("The value for 'text' is a valid PlainText input");
  expect(
    testItemValidations("A".repeat(129), {
      type: "PlainText",
      validations: { maxLength: 128 },
      slug: "business-name",
    })[1]
  ).toBe(
    "The value for 'business-name' must not exceed the max character count of 128"
  );
  expect(
    testItemValidations(23, {
      type: "PlainText",
      validations: { maxLength: 256 },
      slug: "first-name",
    })[1]
  ).toBe("The value for 'first-name' is not a string value");
  expect(
    testItemValidations(true, {
      type: "PlainText",
      validations: { maxLength: 256 },
      slug: "last-name",
    })[1]
  ).toBe("The value for 'last-name' is not a string value");
});
