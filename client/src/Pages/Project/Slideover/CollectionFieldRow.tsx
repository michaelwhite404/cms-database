import React, { useEffect, useRef } from "react";
import { CollectionDataFields } from "../../../../../src/interfaces/collectionDataInterfaces";
import PlainTextIcon from "../../../components/Icons/FieldMiniIcons/PlainTextIcon";
import fieldTypeToText from "../../../utils/fieldTypeToText";
import fieldTypeToForm from "../../../utils/fieldTypeToForm";
import FormProps from "../../../interfaces/FormProps";

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

	const Form: (props: FormProps) => JSX.Element =
		// @ts-ignore
		activeField?.type && fieldTypeToForm[activeField.type];

	return (
		<div
			className="border-b py-2.5 px-4 text-xs text-gray-700 relative"
			style={{ userSelect: "none" }}
			ref={myRef}
			onClick={handleClick}
		>
			<div className="flex items-center">
				<PlainTextIcon className="mr-3" />
				<span className="mr-3">{name}</span>
				<span className="text-gray-400">({fieldTypeToText[type]})</span>
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
