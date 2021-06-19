import { useEffect, useState } from "react";
import { CollectionValidationsKeys } from "../../../../../src/interfaces/collectionInterfaces";
import NumberInput from "../../../components/Form/NumberInput";
import FormErrors from "../../../interfaces/FormErrors";
import FormProps from "../../../interfaces/FormProps";
import StandardForm from "../StandardForm";

export default function RichTextForm({
	activeField,
	setActiveField,
	submitNewField,
	changeValidationField,
}: FormProps) {
	const initialErrors = { name: "", minLength: "", maxLength: "" };
	const [errors, setErrors] = useState<FormErrors>(initialErrors);

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
		<StandardForm
			activeField={activeField}
			setActiveField={setActiveField}
			errors={errors}
			setErrors={setErrors}
			submitNewField={submitNewField}
		>
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
	);
}
