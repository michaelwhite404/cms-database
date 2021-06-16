import React, { useRef } from "react";
import { CollectionDataFields } from "../../../../../src/interfaces/collectionDataInterfaces";
import PlainTextIcon from "../../../components/Icons/FieldMiniIcons/PlainTextIcon";
import StandardInput from "./StandardInput";

interface BasicFieldRowProps {
	field: CollectionDataFields;
	active: boolean;
	activeField: CollectionDataFields | null;
	setActiveField: React.Dispatch<React.SetStateAction<CollectionDataFields | null>>;
	submitField: (tempId: string) => void;
	changeValidationField: (name: string, value: any) => void;
}

export default function BasicFieldRow({
	field,
	active,
	activeField,
	setActiveField,
	submitField,
	changeValidationField,
}: BasicFieldRowProps) {
	const { name } = field;
	const myRef = useRef<HTMLDivElement>(null);

	const handleClick = () => {
		if (!active) {
			setActiveField(field);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setActiveField({ ...activeField!, [e.target!.name]: e.target!.value });
	};

	const handleCancel = () => {
		setActiveField(null);
	};

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		submitField(field.tempId);
		setActiveField(null);
	};

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
				<span className="text-gray-400">(Plain Text)</span>
			</div>
			{active && (
				<div className="mt-4">
					<StandardInput
						title="Label"
						id="fieldName"
						name="name"
						value={activeField!.name}
						handleChange={handleChange}
						required
					/>
					<StandardInput
						className="mt-5"
						title="Help Text"
						id="fieldHelpText"
						name="helpText"
						value={activeField!.helpText || ""}
						helpText="Appears below the label to guide Collaborators, just like this help text"
						handleChange={handleChange}
					/>
					<div className="flex justify-end xs:mt-4 absolute right-3 top-3">
						<button
							type="button"
							className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							onClick={handleCancel}
						>
							Cancel
						</button>
						<button
							type="button"
							className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							onClick={handleSubmit}
						>
							Save Field
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
