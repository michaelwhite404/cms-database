import React, { useEffect, useRef } from "react";
import { CollectionDataFields } from "../../../../../src/interfaces/collectionDataInterfaces";
import { getFieldDataByType } from "../../../utils/fieldTypeData";

interface CollectionFieldRowProps {
	field: CollectionDataFields;
	active: boolean;
	activeField: CollectionDataFields | null;
	setActiveField: React.Dispatch<React.SetStateAction<CollectionDataFields | null>>;
	submitField: (tempId: string) => void;
	changeValidationField: (name: string, value: any) => void;
}

export default function CollectionFieldRow({
	field,
	active,
	activeField,
	setActiveField,
	submitField,
	changeValidationField,
}: CollectionFieldRowProps) {
	const myRef = useRef<HTMLDivElement>(null);
	const { name, type, required } = field;

	const handleClick = () => {
		if (!active) {
			setActiveField(field);
		}
	};

	useEffect(() => {
		active && myRef.current!.scrollIntoView({ behavior: "smooth" });
	}, [active]);

	const Form = getFieldDataByType(type, "Form");
	const SmallIcon = getFieldDataByType(type, "SmallIcon");

	return (
		<div
			className="border-b py-2.5 px-4 text-xs text-gray-700 relative"
			style={{ userSelect: "none" }}
			ref={myRef}
			onClick={handleClick}
		>
			<div className="flex items-center">
				<SmallIcon className="mr-3" />
				<span className="mr-3">{name}</span>
				<span className="text-gray-400">({getFieldDataByType(type, "name")})</span>
				{required && <span className="text-gray-400 ml-auto">Required Field</span>}
			</div>
			{active && (
				<div className="mt-4">
					<Form
						activeField={activeField}
						setActiveField={setActiveField}
						// @ts-ignore
						submitNewField={() => submitField(field.tempId)}
						changeValidationField={changeValidationField}
					/>
				</div>
			)}
		</div>
	);
}
