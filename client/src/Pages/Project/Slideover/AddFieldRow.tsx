/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowCircleDownIcon, PlusIcon, XIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef } from "react";
import FieldTypeButton from "./FieldTypeButton";
import ButtonIcon from "../../../components/Icons/ButtonIcon";
import PlainTextIcon from "../../../components/Icons/FieldMiniIcons/PlainTextIcon";
import { CollectionDataFields } from "../../../../../src/interfaces/collectionDataInterfaces";
import {
	CollectionFieldType,
	CollectionValidations,
} from "../../../../../src/interfaces/collectionInterfaces";
import fieldTypeToText from "../../../utils/fieldTypeToText";
import fieldTypeToForm from "../../../utils/fieldTypeToForm";
import FormProps from "../../../interfaces/FormProps";

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

interface FieldButton {
	name: string;
	type: CollectionFieldType;
	Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
	validations?: any;
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

	const fieldButtons: FieldButton[] = [
		{
			name: "Plain Text",
			type: "PlainText",
			Icon: ButtonIcon.PlainText,
			validations: { singleLine: true, minLength: "", maxLength: "" },
		},
		{
			name: "Rich Text",
			type: "RichText",
			Icon: ButtonIcon.RichText,
			validations: { singleLine: true, minLength: "", maxLength: "" },
		},
		{ name: "Image", type: "ImageRef", Icon: ButtonIcon.Image, validations: { singleLine: true } },
		{
			name: "Video Link",
			type: "Video",
			Icon: ButtonIcon.Video,
			validations: { singleLine: true },
		},
		{ name: "Link", type: "Link", Icon: ButtonIcon.Link, validations: { singleLine: true } },
		{ name: "Email", type: "Email", Icon: ButtonIcon.Email, validations: { singleLine: true } },
		{ name: "Phone", type: "Phone", Icon: ButtonIcon.Phone, validations: { singleLine: true } },
		{
			name: "Number",
			type: "Number",
			Icon: ButtonIcon.Number,
			validations: {
				format: "integer",
				maximum: "",
				minimum: "",
				decimalPlaces: 0,
				allowNegative: false,
			},
		},
		{ name: "Date", type: "Date", Icon: ButtonIcon.Date },
		{ name: "Switch", type: "Bool", Icon: ButtonIcon.Bool },
		{ name: "Color", type: "Color", Icon: ButtonIcon.Color, validations: { singleLine: true } },
		{ name: "Option", type: "Option", Icon: ButtonIcon.Option },
		// { name: "File", type: "File", Icon: ButtonIcon.File },
		{ name: "Reference", type: "ItemRef", Icon: ButtonIcon.Reference },
		{ name: "Multi Reference", type: "ItemRefMulti", Icon: ButtonIcon.MultiReference },
	];

	const Form: (props: FormProps) => JSX.Element =
		// @ts-ignore
		activeField?.type && fieldTypeToForm[activeField.type];

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
							<PlainTextIcon className="mr-3" />
							<span className="mr-3">New Field</span>
							<span className="text-gray-400">({fieldTypeToText[activeField!.type]})</span>
						</>
					))}
			</div>
			{active &&
				(!activeField?.type ? (
					<div className="grid grid-cols-6 gap-4 mt-5 mb-2.5">
						{fieldButtons.map((field) => (
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
