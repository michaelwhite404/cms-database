import React from "react";
import { CollectionDataFields } from "../../../../../src/interfaces/collectionDataInterfaces";
import {
	CollectionFieldType,
	CollectionValidations,
} from "../../../../../src/interfaces/collectionInterfaces";

interface FieldTypeButtonProps {
	field: {
		name: string;
		type: CollectionFieldType;
		Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
		validations?: CollectionValidations<any>;
	};
	activeField: CollectionDataFields | null;
	setActiveField: React.Dispatch<React.SetStateAction<CollectionDataFields | null>>;
}

export default function FieldTypeButton({
	field,
	activeField,
	setActiveField,
}: FieldTypeButtonProps) {
	const { name, type, Icon, validations } = field;
	const handleClick = () => {
		setActiveField({ ...activeField!, validations, type });
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
