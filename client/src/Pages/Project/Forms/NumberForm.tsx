import React, { useEffect, useRef, useState } from "react";
import NumberInput from "../../../components/Form/NumberInput";
import FormProps from "../../../interfaces/FormProps";
import StandardInput from "../../../components/Form/StandardInput";
import SelectGroup from "../../../components/Form/SelectGroup";
import Checkbox from "../../../components/Form/Checkbox";
import {
	CollectionFormat,
	CollectionValidations,
	CollectionValidationsKeys,
	NumberFormat,
} from "../../../../../src/interfaces/collectionInterfaces";
import countDecimals from "../../../utils/countDecimals";

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
	// { text: "Any Format", value: "any" },
];

interface InputValidations {
	minimum: number | string;
	maximum: number | string;
	allowNegative: boolean;
	format: CollectionFormat<NumberFormat>;
	decimalPlaces: number;
}

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

	const validations = activeField?.validations as CollectionValidations<NumberFormat>;

	useEffect(() => {
		const minErr = validateMinimum();
		const maxErr = validateMaximum();
		setErrors({ ...errors, minimum: minErr, maximum: maxErr });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		validations.minimum,
		validations.maximum,
		validations.allowNegative,
		validations.format,
		validations.decimalPlaces,
	]);

	const precisionRef = useRef<HTMLSelectElement>(null);

	/** Value stores if the form can be submitted */
	const submittable = !!!errors.minimum.length && !!!errors.maximum.length && !!activeField!.name;

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		submitNewField();
		setActiveField(null);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setActiveField({ ...activeField!, [e.target!.name]: e.target!.value });
	};

	const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target as { name: CollectionValidationsKeys; value: NumberFormat };
		setActiveField({
			...activeField!,
			validations: {
				...activeField?.validations,
				format: value,
				decimalPlaces: value === "integer" ? 0 : 1,
			},
		});
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setActiveField({ ...activeField!, [name]: checked });
	};

	const handleValidationCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target as { name: CollectionValidationsKeys; checked: boolean };
		changeValidationField?.(name, checked);
	};

	const handleArrowChange = (
		operator: "increment" | "decrement",
		name: CollectionValidationsKeys,
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

	const handleNumberValidationChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		let { name, value } = e.target as { name: CollectionValidationsKeys; value: any };
		if (value !== "" && (value as string).substr(-1) !== "." && !isNaN(Number(value)))
			value = Number(value);
		changeValidationField?.(name, value);
	};

	/**
	 * Validates if the minimum property is valid
	 * @returns {string} The error message if minimum not valid. Empty string if valid.
	 */
	const validateMinimum = (): string => {
		const { minimum, maximum, allowNegative, format, decimalPlaces } =
			validations as InputValidations;
		if (minimum === "") return "";
		if (typeof minimum === "string") return "This field must be a number";
		if (format === "integer" && countDecimals(minimum) > 0) return "Must be an integer";
		if (format === "decimal" && countDecimals(minimum) > decimalPlaces)
			return `Must have at most ${decimalPlaces} decimal places`;
		if (!allowNegative && minimum < 0) return "Enter a number greater than or equal to 0";
		if (typeof maximum === "number" && minimum > maximum)
			return `Enter a number less than or equal to ${maximum}`;
		return "";
	};

	/**
	 * Validates if the maximum property is valid
	 * @returns {string} The error message if maximum not valid. Empty string if valid.
	 */
	const validateMaximum = (): string => {
		const { minimum, maximum, allowNegative, format, decimalPlaces } =
			validations as InputValidations;
		if (maximum === "") return "";
		if (typeof maximum === "string") return "This field must be a number";
		if (format === "integer" && countDecimals(maximum) > 0) return "Must be an integer";
		if (format === "decimal" && countDecimals(maximum) > decimalPlaces)
			return `Must have at most ${decimalPlaces} decimal places`;
		if (!allowNegative && maximum < 0) return "Enter a number greater than or equal to 0";
		if (typeof minimum === "number" && minimum > maximum)
			return `Enter a number greater than or equal to ${minimum}`;
		return "";
	};

	return (
		<div className="mt-4">
			<StandardInput
				title="Label"
				id="fieldName"
				name="name"
				value={activeField!.name}
				handleChange={handleChange}
				errorMessage={errors.name}
				required
				focus
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
					increment={() => handleArrowChange("increment", "minimum", `${validations.minimum}`)}
					decrement={() => handleArrowChange("decrement", "minimum", `${validations.minimum}`)}
					errorMessage={errors.minimum}
				/>
				<NumberInput
					title="Maximum Number"
					id="maxNumber"
					name="maximum"
					value={validations.maximum}
					handleChange={handleNumberValidationChange}
					arrows
					increment={() => handleArrowChange("increment", "maximum", `${validations.maximum}`)}
					decrement={() => handleArrowChange("decrement", "maximum", `${validations.maximum}`)}
					errorMessage={errors.maximum}
				/>
			</div>
			{/** Format Option Dropdown */}
			<div className="mt-4">
				<SelectGroup
					title="Format"
					name="format"
					id="numberFormat"
					onChange={handleFormatChange}
					value={validations.format}
					required
				>
					{formatOptions.map((opt) => (
						<SelectGroup.Option key={opt.value} value={opt.value}>
							{opt.text}
						</SelectGroup.Option>
					))}
				</SelectGroup>
			</div>
			{/** Precision Option Dropdown */}
			<div className="mt-4">
				{validations.format === "decimal" && (
					<SelectGroup
						title="Precision"
						name="decimalPlaces"
						id="decimalPlaces"
						refer={precisionRef}
						required
						onChange={handleNumberValidationChange}
						value={`${validations.decimalPlaces}`}
					>
						{precisionOptions.map((opt) => (
							<SelectGroup.Option key={opt.value} value={opt.value}>
								{opt.text}
							</SelectGroup.Option>
						))}
					</SelectGroup>
				)}
				{/* Allow Negative Check */}
				<Checkbox
					id="fieldValidationAllowNegative"
					name="allowNegative"
					onChange={handleValidationCheckboxChange}
					checked={validations.allowNegative}
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
