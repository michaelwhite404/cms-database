import faker from "faker";
import moment from "moment";
import { Types } from "mongoose";
import { CollectionField, CollectionValidationOption } from "../interfaces/collectionInterfaces";
import Item from "../models/itemModel";

const convertToFakeValue = async (field: CollectionField) => {
	let value: any = "";
	switch (field.type) {
		case "Bool":
			value = faker.datatype.boolean();
			break;
		case "Color":
			value = faker.internet.color();
			break;
		case "Date":
			value = faker.date.between(
				moment().subtract(3, "months").toString(),
				moment().add(3, "months").toString()
			);
			break;
		case "Email":
			value = faker.internet.email();
			break;
		/* case "ImageRef":
      break; */
		/* case "File":
      break; */
		case "ItemRef":
			const items = await Item.aggregate([
				{ $match: { _cid: field.validations!.collectionId } },
				{ $sample: { size: 1 } },
			]);
			console.log(items);
			value = items[0]._id;
			break;
		case "ItemRefMulti":
			const itemsM = await Item.aggregate([
				{ $match: { _cid: Types.ObjectId(field.validations!.collectionId) } },
				{ $sample: { size: 1 } },
			]);
			value = [itemsM[0]._id];
			break;
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
			let { minLength, maxLength } = field.validations!;
			if (!minLength && !maxLength) {
				minLength = 5;
				maxLength = 25;
			}
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
