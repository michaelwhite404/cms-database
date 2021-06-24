import React from "react";
import { CollectionFieldType } from "../../../../../src/interfaces/collectionInterfaces";
import { ItemModel } from "../../../../../src/interfaces/itemInterfaces";

interface FieldDisplay {
	type: CollectionFieldType;
	slug: string;
	name: string;
	show: boolean;
}

interface Props {
	item: ItemModel;
	fieldDisplay: FieldDisplay[];
}

const formatData = (value: any, type: CollectionFieldType) => {
	let formattedValue: any = "";
	switch (type) {
		case "Date":
			formattedValue = new Date(value).toLocaleDateString();
			break;
		default:
			formattedValue = value;
			break;
	}
	return formattedValue;
};

export default function CollectionItemsRow({ fieldDisplay, item }: Props) {
	const display = fieldDisplay.filter((f) => f.show === true);
	return (
		<tr className="py-8 hover:bg-blue-50">
			{display.map((field, i) => (
				<td className={`${i === 0 ? "" : "w-40"} whitespace-nowrap pl-6 py-2.5 border-b`}>
					{formatData(item[field.slug], field.type)}
				</td>
			))}
			<td className="whitespace-nowrap py-2.5 border-b w-8" />
		</tr>
	);
}
