import faker from "faker";
import { CollectionField, CollectionValidationOption } from "../interfaces/collectionInterfaces";

const convertToFakeValue = (field: CollectionField) => {
	let value: any = "";
	switch (field.type) {
		case "Bool":
			value = faker.datatype.boolean();
			break;
		case "Color":
			value = faker.internet.color();
			break;
		/* case "Date":
      break; */
		case "Email":
			value = faker.internet.email();
			break;
		/* case "ImageRef":
      break; */
		/* case "ItemRef":
      break; */
		case "Link":
			value = faker.internet.url();
			break;
		case "Number":
			let { minimum, maximum, allowNegative, decimalPlaces } = field.validations!;
			if (minimum && !maximum) maximum = minimum + 100;
			else if (!minimum && maximum) minimum = allowNegative ? maximum - 100 : 0;
			else if (!minimum && !maximum) {
				minimum = 0;
				maximum = 100;
			}
			value = Math.random() * (maximum! - minimum!) + minimum!;
			if (value === Math.floor(value)) break;
			const split = (value as number).toString().split(".");
			value = Number(split[0] + "." + split[1].substring(0, decimalPlaces!));
			break;
		case "Option":
			value = faker.random.arrayElement(
				field.validations!.options! as CollectionValidationOption[]
			)._id;
			break;
		case "Phone":
			faker.phone.phoneNumberFormat(2);
			break;
		case "PlainText":
			let count = 0;
			const { minLength, maxLength } = field.validations!;
			count = minLength ? minLength + 3 : 35;
			const words = faker.lorem.words(count);
			value = words.substr(
				0,
				faker.datatype.number({ min: minLength || 1, max: maxLength || words.length })
			);
			break;
		/* case "RichText":
      break; */
		/* case "Video":
			break; */
	}
	return value;
};

export default convertToFakeValue;
