import React, { useEffect, useRef, useState } from "react";
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
		name: "",
		minLength: "",
		maxLength: "",
	});

	useEffect(() => {
		const minErr = validateMinLength();
		const maxErr = validateMaxLength();
		setErrors({ ...errors, minLength: minErr, maxLength: maxErr });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeField?.validations?.minLength, activeField?.validations?.maxLength]);

	const requiredRef = useRef<HTMLInputElement>();

	const submittable =
		!!!errors.minLength.length && !!!errors.maxLength.length && !!activeField!.name;

	/**
	 * Validates the necessary PlainText Fields
	 * @returns If the field can be submitted
	 */
	const validate = () => {
		if (!activeField!.name) setErrors({ ...errors, name: "This field is required" });
		return submittable;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		name === "name" && value.length === 0
			? setErrors({ ...errors, name: "This field is required" })
			: setErrors({ ...errors, name: "" });
		setActiveField({ ...activeField!, [e.target!.name]: e.target!.value });
	};

	const handleNumberValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let { value, name }: { value: any; name: string } = e.target;
		if (value !== "" && !isNaN(Number(value))) value = Number(value);
		else setErrors({ ...errors, [name]: "This field must be a number" });
		changeValidationField && changeValidationField!(e.target.name, value);
	};

	const validateMinLength = (): string => {
		const { minLength, maxLength } = activeField?.validations!;
		if (!minLength) return "";
		if (typeof minLength === "string") return "This field must be a number";
		if (minLength < 0) return "Enter a number greater than 0";
		if (maxLength && maxLength > 0 && !isNaN(Number(maxLength)) && minLength > maxLength)
			return `Enter a number less than ${maxLength}`;
		return "";
	};

	const validateMaxLength = (): string => {
		const { minLength, maxLength } = activeField?.validations!;
		if (typeof maxLength === "number" && maxLength < 1) return "Enter a number greater than 1";
		if (!maxLength) return "";
		if (typeof maxLength === "string") return "This field must be a number";
		if (minLength && minLength > 1 && !isNaN(Number(minLength)) && minLength > maxLength)
			return `Enter a number greater than ${minLength}`;
		return "";
	};

	const handleRadioChange = () => {
		const singleLine =
			document.querySelector<HTMLInputElement>("input[name='singleLine']:checked")!.value ===
			"singleLine";
		changeValidationField && changeValidationField!("singleLine", singleLine);
	};
	const handleRequiredChange = () => {
		setActiveField({ ...activeField!, required: requiredRef.current?.checked });
	};

	const handleCancel = () => {
		setFieldSelected(undefined);
		setActiveField(null);
	};

	const handleArrowChange = (
		operator: "increment" | "decrement",
		name: string,
		currentValue: string
	) => {
		const choice = { increment: 1, decrement: -1 };
		let newValue = operator === "increment" ? 1 : 0;
		if (!isNaN(Number(currentValue))) {
			newValue = Number(currentValue) + choice[operator];
		}
		changeValidationField && changeValidationField!(name, Number(newValue));
	};

	const handleSubmit = () => {
		if (validate()) submitNewField();
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
				errorMessage={errors.name}
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
						handleArrowChange("increment", "minLength", `${activeField!.validations!.minLength}`)
					}
					decrement={() =>
						handleArrowChange("decrement", "minLength", `${activeField!.validations!.minLength}`)
					}
					errorMessage={errors.minLength}
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
						handleArrowChange("increment", "maxLength", `${activeField!.validations!.maxLength}`)
					}
					decrement={() =>
						handleArrowChange("decrement", "maxLength", `${activeField!.validations!.maxLength}`)
					}
					errorMessage={errors.maxLength}
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
					className={`${
						submittable
							? "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							: "bg-blue-400 cursor-not-allowed"
					} ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white focus:outline-none`}
					onClick={handleSubmit}
				>
					Save Field
				</button>
			</div>
		</div>
	);
}
