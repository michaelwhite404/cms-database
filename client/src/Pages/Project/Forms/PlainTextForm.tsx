import React, { useEffect, useState } from "react";
import NumberInput from "../../../components/Form/NumberInput";
import StandardRadioGroup from "../../../components/Form/StandardRadioGroup";
import FormProps from "../../../interfaces/FormProps";
import { CollectionValidationsKeys } from "../../../../../src/interfaces/collectionInterfaces";
import FormErrors from "../../../interfaces/FormErrors";
import StandardForm from "../StandardForm";

export default function PlainTextForm({
	activeField,
	setActiveField,
	submitNewField,
	changeValidationField,
}: FormProps) {
	const [errors, setErrors] = useState<FormErrors>({ name: "", minLength: "", maxLength: "" });

	useEffect(() => {
		const minErr = validateMinLength();
		const maxErr = validateMaxLength();
		setErrors({ ...errors, minLength: minErr, maxLength: maxErr });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeField?.validations?.minLength, activeField?.validations?.maxLength]);

	const handleNumberValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let { name, value } = e.target as { name: CollectionValidationsKeys; value: any };
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

	return (
		<div className="mt-4">
			<StandardForm
				activeField={activeField}
				setActiveField={setActiveField}
				errors={errors}
				setErrors={setErrors}
				submitNewField={submitNewField}
			>
				{/* Radio input for single or multiple line */}
				<StandardRadioGroup className="mt-5" title="Text Field Type" name="singleLine">
					<StandardRadioGroup.Option
						value="singleLine"
						onChange={handleRadioChange}
						defaultChecked={activeField?.validations?.singleLine === true}
					>
						Single Line - {<span className="text-gray-400">For short text</span>}
					</StandardRadioGroup.Option>
					<StandardRadioGroup.Option
						value="multipleLine"
						onChange={handleRadioChange}
						defaultChecked={activeField?.validations?.singleLine === false}
					>
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
			</StandardForm>
		</div>
	);
}
