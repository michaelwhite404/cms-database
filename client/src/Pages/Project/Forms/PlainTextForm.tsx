import React, { useRef, useState } from "react";
import { CollectionDataFields } from "../../../../../src/interfaces/collectionDataInterfaces";
import { CollectionFieldType } from "../../../../../src/interfaces/collectionInterfaces";
import NumberInput from "../../../components/Form/NumberInput";
import StandardRadioGroup from "../../../components/Form/StandardRadioGroup";
import StandardInput from "../Slideover/StandardInput";

interface PlainTextFormProps {
	activeField: CollectionDataFields | null;
	setActiveField: React.Dispatch<React.SetStateAction<CollectionDataFields | null>>;
	setFieldSelected: React.Dispatch<React.SetStateAction<CollectionFieldType | undefined>>;
	submitNewField: () => void;
	changeValidationField?: (name: string, value: any) => void;
}

export default function PlainTextForm({
	activeField,
	setActiveField,
	setFieldSelected,
	submitNewField,
	changeValidationField,
}: PlainTextFormProps) {
	const [errors, setErrors] = useState({
		label: "",
		minLength: "",
		maxLength: "",
	});
	const requiredRef = useRef<HTMLInputElement>();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		name === "name" && value.length === 0
			? setErrors({ ...errors, label: "This field is required" })
			: setErrors({ ...errors, label: "" });
		setActiveField({ ...activeField!, [e.target!.name]: e.target!.value });
	};
	const handleValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		changeValidationField && changeValidationField(e.target.name, e.target.value);
	};

	const handleNumberValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value: any = e.target.value;
		if (value !== "" && !isNaN(Number(e.target.value))) value = Number(value);
		changeValidationField && changeValidationField(e.target.name, value);
	};

	const handleRadioChange = () => {
		const singleLine =
			document.querySelector<HTMLInputElement>("input[name='singleLine']:checked")!.value ===
			"singleLine";
		setActiveField({
			...activeField!,
			validations: {
				...activeField?.validations,
				singleLine,
			},
		});
	};
	const handleRequiredChange = () => {
		setActiveField({ ...activeField!, required: requiredRef.current?.checked });
	};

	const handleCancel = () => {
		setFieldSelected(undefined);
		setActiveField(null);
	};

	const handleNumberChange = (
		operator: "increment" | "decrement",
		name: string,
		currentValue: string
	) => {
		const choice = { increment: 1, decrement: -1 };
		let newValue = operator === "increment" ? 1 : 0;
		if (!isNaN(Number(currentValue))) newValue = Number(currentValue) + choice[operator];
		setActiveField({
			...activeField!,
			validations: {
				...activeField?.validations,
				[name]: Number(newValue),
			},
		});
	};

	return (
		<div className="mt-4">
			{/* Text input for field name */}
			<StandardInput
				title="Label"
				id="fieldName"
				name="name"
				value={activeField!.name || ""}
				handleChange={handleChange}
				errorMessage={errors.label}
				required
			/>
			{/* Text input for field helpText */}
			<StandardInput
				className="mt-5"
				title="Help Text"
				id="fieldHelpText"
				name="helpText"
				value={activeField!.helpText || ""}
				helpText="Appears below the label to guide Collaborators, just like this help text"
				handleChange={handleChange}
			/>
			{/* Radio input for single or multiple line */}
			<StandardRadioGroup className="mt-5" title="Text Field Type" name="singleLine">
				<StandardRadioGroup.Option value="singleLine" onChange={handleRadioChange} defaultChecked>
					Single Line - {<span className="text-gray-400">For short text</span>}
				</StandardRadioGroup.Option>
				<StandardRadioGroup.Option value="multipleLine" onChange={handleRadioChange}>
					Multiple Line - {<span className="text-gray-400">For long text</span>}
				</StandardRadioGroup.Option>
			</StandardRadioGroup>
			{/* Inputs for min and max length */}
			<div className="mt-5 grid grid-cols-2 gap-x-10">
				<NumberInput
					title="Minimum Character Count (with spaces)"
					id="minCount"
					name="minLength"
					value={activeField!.validations!.minLength}
					placeholder="E.g. 25"
					handleChange={handleNumberValidationChange}
					arrows
					increment={() =>
						handleNumberChange("increment", "minLength", `${activeField!.validations!.minLength}`)
					}
					decrement={() =>
						handleNumberChange("decrement", "minLength", `${activeField!.validations!.minLength}`)
					}
				/>
				<NumberInput
					title="Maximum Character Count (with spaces)"
					id="maxCount"
					name="maxLength"
					value={activeField!.validations!.maxLength}
					placeholder="E.g. 140"
					handleChange={handleNumberValidationChange}
					arrows
					increment={() =>
						handleNumberChange("increment", "maxLength", `${activeField!.validations!.maxLength}`)
					}
					decrement={() =>
						handleNumberChange("decrement", "maxLength", `${activeField!.validations!.maxLength}`)
					}
				/>
			</div>
			{/* Required Check */}
			<div className="mt-3 mb-1 font-normal text-sm">
				<label>
					<input
						className="focus:ring-indigo-500 h-4 w-4 mr-3 text-indigo-600 border-gray-300 rounded"
						type="checkbox"
						id="fieldRequired"
						name="required"
						//@ts-ignore
						ref={requiredRef!}
						onChange={handleRequiredChange}
					/>
					<label htmlFor="fieldRequired">This field is required</label>
				</label>
			</div>
			{/* Save and cancel buttons */}
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
					onClick={submitNewField}
				>
					Save Field
				</button>
			</div>
		</div>
	);
}
