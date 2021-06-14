import React from "react";
import { v4 as uuid } from "uuid";
import { CollectionDataFields } from "../../../../../src/interfaces/collectionDataInterfaces";
import { CollectionFieldType } from "../../../../../src/interfaces/collectionInterfaces";

interface FieldTypeButtonProps {
	name: string;
	type: CollectionFieldType;
	Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
	activeField: CollectionDataFields | null;
	setActiveField: React.Dispatch<React.SetStateAction<CollectionDataFields | null>>;
}

// const inititalFieldTypeState: any = {};
// inititalFieldTypeState.PlainText = {
// 	tempId: uuid(),
// 	name: "",
// 	type: "PlainText",
// 	helpText: "",
// 	required: false,
// 	validations: { singleLine: true, minLength: "", maxLength: "" },
// };

export default function FieldTypeButton({
	name,
	type,
	Icon,
	activeField,
	setActiveField,
}: FieldTypeButtonProps) {
	const handleClick = () => {
		setActiveField({ ...activeField!, type });
	};

	return (
		<button
			type="button"
			className="grid place-items-center p-1 bg-gray-50 rounded-lg shadow-md focus:outline-none hover:bg-gray-100"
			style={{ gridTemplateRows: "75px 25px" }}
			onClick={handleClick}
		>
			<Icon color="#7c3aed" />
			<div>{name}</div>
		</button>
	);
}
