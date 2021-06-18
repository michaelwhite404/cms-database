import React, { useContext, useEffect, useState } from "react";
import NumberInput from "../../../components/Form/NumberInput";
import StandardRadioGroup from "../../../components/Form/StandardRadioGroup";
import NewCollectionContext from "../../../context/NewCollectionContext";
import FormProps from "../../../interfaces/FormProps";
import StandardInput from "../../../components/Form/StandardInput";
import Checkbox from "../../../components/Form/Checkbox";

export default function PlainTextForm({
	activeField,
	setActiveField,
	submitNewField,
	changeValidationField,
}: FormProps) {
	const [newCollectionData] = useContext(NewCollectionContext);
	const currentFields = newCollectionData.fields;
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

	/** Value stores if the form can be submitted */
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
		const duplicate = currentFields
			.filter((f) => f.tempId !== activeField!.tempId)
			.map((f) => f.name)
			.includes(value);
		if (name === "name")
			if (value.length === 0) setErrors({ ...errors, name: "This field is required" });
			else if (duplicate) setErrors({ ...errors, name: "Already Exists" });
			else setErrors({ ...errors, name: "" });
		setActiveField({ ...activeField!, [name]: value });
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setActiveField({ ...activeField!, [name]: checked });
	};

	const handleNumberValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let { name, value }: { value: any; name: string } = e.target;
		if (value !== "" && !isNaN(Number(value))) value = Number(value);
		changeValidationField?.(name, value);
	};

	/**
	 * Validates if the minLength property is valid
	 * @returns {string} The error message if minLength not valid. Empty string if valid.
	 */
	const validateMinLength = (): string => {
		const { minLength, maxLength } = activeField?.validations!;
		if (!minLength) return "";
		if (typeof minLength === "string") return "This field must be a number";
		if (minLength < 0) return "Enter a number greater than 0";
		if (maxLength && maxLength > 0 && !isNaN(Number(maxLength)) && minLength > maxLength)
			return `Enter a number less than ${maxLength}`;
		return "";
	};

	/**
	 * Validates if the maxLength property is valid
	 * @returns {string} The error message if maxLength not valid. Empty string if valid.
	 */
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
		changeValidationField?.("singleLine", singleLine);
	};

	const handleCancel = () => {
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
		changeValidationField?.(name, Number(newValue));
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
				focus
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
			<Checkbox
				id="fieldRequired"
				name="required"
				onChange={handleCheckboxChange}
				checked={activeField?.required}
			>
				This field is required
			</Checkbox>
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
