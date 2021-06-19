import { useState } from "react";
import Checkbox from "../../../components/Form/Checkbox";
import FormProps from "../../../interfaces/FormProps";
import StandardForm from "../StandardForm";

export default function DateForm({
	activeField,
	setActiveField,
	submitNewField,
	changeValidationField,
}: FormProps) {
	const [errors, setErrors] = useState({ name: "" });

	const handleFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		changeValidationField?.("format", e.target.checked ? "date-time" : "date");
	};

	return (
		<StandardForm
			activeField={activeField}
			setActiveField={setActiveField}
			errors={errors}
			setErrors={setErrors}
			submitNewField={submitNewField}
		>
			<Checkbox
				id="fieldValidationFormat"
				name="format"
				onChange={handleFormatChange}
				checked={activeField?.validations?.format === "date-time"}
			>
				Include date picker
			</Checkbox>
		</StandardForm>
	);
}
