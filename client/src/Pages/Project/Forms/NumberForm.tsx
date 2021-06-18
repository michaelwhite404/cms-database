import React, { useRef, useState } from "react";
import NumberInput from "../../../components/Form/NumberInput";
import FormProps from "../../../interfaces/FormProps";
import StandardInput from "../../../components/Form/StandardInput";
import SelectGroup from "../../../components/Form/SelectGroup";
import Checkbox from "../../../components/Form/Checkbox";

const precisionOptions = [
	{ text: "1.0", value: "1" },
	{ text: "1.00", value: "2" },
	{ text: "1.000", value: "3" },
	{ text: "1.0000", value: "4" },
	{ text: "1.00000", value: "5" },
];

const formatOptions = [
	{ text: "Integer (1)", value: "integer" },
	{ text: "Decimal (1.0)", value: "decimal" },
	{ text: "Any Format", value: "any" },
];

export default function NumberForm({
	activeField,
	setActiveField,
	submitNewField,
	changeValidationField,
}: FormProps) {
	const [errors, setErrors] = useState({
		name: "",
		minimum: "",
		maximum: "",
	});

	const precisionRef = useRef<HTMLSelectElement>(null);

	/** Value stores if the form can be submitted */
	const submittable = Object.values(errors).join("").length === 0;

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		submitNewField();
		setActiveField(null);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setActiveField({ ...activeField!, [e.target!.name]: e.target!.value });
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setActiveField({ ...activeField!, [name]: checked });
	};

	const handleValidationCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		changeValidationField?.(name, checked);
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

	const handleCancel = () => {
		setActiveField(null);
	};

	const handleNumberValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let { name, value }: { value: any; name: string } = e.target;
		if (value !== "" && !isNaN(Number(value))) value = Number(value);
		changeValidationField?.(name, value);
	};

	return (
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
			<div className="mt-5 grid grid-cols-2 gap-x-10">
				<NumberInput
					title="Minimum Number"
					id="minNumber"
					name="minimum"
					value={activeField!.validations!.minimum}
					handleChange={handleNumberValidationChange}
					arrows
					increment={() =>
						handleArrowChange("increment", "minimum", `${activeField!.validations!.minimum}`)
					}
					decrement={() =>
						handleArrowChange("decrement", "minimum", `${activeField!.validations!.minimum}`)
					}
					errorMessage={errors.minimum}
				/>
				<NumberInput
					title="Maximum Number"
					id="maxNumber"
					name="maximum"
					value={activeField!.validations!.maximum}
					handleChange={handleNumberValidationChange}
					arrows
					increment={() =>
						handleArrowChange("increment", "maximum", `${activeField!.validations!.maximum}`)
					}
					decrement={() =>
						handleArrowChange("decrement", "maximum", `${activeField!.validations!.maximum}`)
					}
					errorMessage={errors.maximum}
				/>
			</div>
			{/** Format Option Dropdown */}
			<div className="mt-4">
				<SelectGroup title="Format" name="format" id="numberFormat" required>
					{formatOptions.map((opt) => (
						<SelectGroup.Option key={opt.value} value={opt.value}>
							{opt.text}
						</SelectGroup.Option>
					))}
				</SelectGroup>
			</div>
			{/** Precision Option Dropdown */}
			<div className="mt-4">
				<SelectGroup title="Precision" name="decimalPlaces" id="decimalPlaces" refer={precisionRef}>
					{precisionOptions.map((opt) => (
						<SelectGroup.Option key={opt.value} value={opt.value}>
							{opt.text}
						</SelectGroup.Option>
					))}
				</SelectGroup>
				{/* Allow Negative Check */}
				<Checkbox
					id="fieldValidationAllowNegative"
					name="allowNegative"
					onChange={handleValidationCheckboxChange}
					checked={activeField?.validations?.allowNegative}
				>
					Allow negative numbers
				</Checkbox>
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
