/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowCircleDownIcon, PlusIcon, XIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef } from "react";
import FieldTypeButton from "./FieldTypeButton";
import { CollectionDataFields } from "../../../../../src/interfaces/collectionDataInterfaces";
import { fieldData, getFieldDataByType } from "../../../utils/fieldTypeData";

interface AddFieldRowProps {
	// field: CollectionDataFields;
	activeField: CollectionDataFields | null;
	active: boolean;
	// field: Omit<CollectionDataFields, "type"> & { type?: CollectionFieldType };
	field: { tempId: string };
	setActiveField: React.Dispatch<React.SetStateAction<CollectionDataFields | null>>;
	submitField: (tempId: string) => void;
	submitNewField: () => void;
	changeValidationField: (name: string, value: any) => void;
}

export default function AddFieldRow({
	activeField,
	active,
	field,
	setActiveField,
	submitField,
	submitNewField,
	changeValidationField,
}: AddFieldRowProps) {
	const myRef = useRef<HTMLDivElement>(null);

	const handleClick = () => {
		if (!active) {
			// @ts-ignore
			setActiveField(field);
		}
	};

	useEffect(() => {
		active && myRef.current!.scrollIntoView({ behavior: "smooth" });
	}, [active]);

	const Form = activeField?.type! && getFieldDataByType(activeField.type, "Form");
	const SmallIcon = activeField?.type! && getFieldDataByType(activeField?.type!, "SmallIcon");

	return (
		<div
			className={`py-2.5 px-4 text-xs text-gray-700 relative ${!active && "hover:bg-gray-50"}`}
			style={{ userSelect: "none" }}
			ref={myRef}
			onClick={handleClick}
		>
			<div className="flex items-center font-semibold">
				{!active && (
					<span className="flex items-center text-purple-600">
						<PlusIcon className="mr-3" width={16} />
						<span className="mr-3">Add Field</span>
					</span>
				)}
				{active &&
					(!activeField?.type ? (
						<>
							<ArrowCircleDownIcon className="mr-3" width={16} />
							<span className="mr-3">Select Field Type</span>
							<button
								className="flex text-gray-400 ml-auto focus:outline-none hover:text-gray-500"
								onClick={() => setActiveField(null)}
							>
								<XIcon className="mr-1.5 " width={16} />
								Cancel
							</button>
						</>
					) : (
						<>
							{active && activeField?.type && <SmallIcon className="mr-3" />}
							<span className="mr-3">New Field</span>
							<span className="text-gray-400">
								({getFieldDataByType(activeField.type, "name")})
							</span>
						</>
					))}
			</div>
			{active &&
				(!activeField?.type ? (
					<div className="grid grid-cols-6 gap-4 mt-5 mb-2.5">
						{fieldData.map((field) => (
							<FieldTypeButton
								key={field.type}
								field={field}
								activeField={activeField}
								setActiveField={setActiveField}
							/>
						))}
					</div>
				) : (
					<Form
						activeField={activeField}
						setActiveField={setActiveField}
						submitNewField={submitNewField}
						changeValidationField={changeValidationField}
					/>
				))}
		</div>
	);
}
