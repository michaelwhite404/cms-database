import { useState } from "react";
import FormProps from "../../../interfaces/FormProps";
import StandardForm from "../StandardForm";

export default function BasicForm({ activeField, setActiveField, submitNewField }: FormProps) {
	const [errors, setErrors] = useState({ name: "" });
	return (
		<StandardForm
			activeField={activeField}
			setActiveField={setActiveField}
			errors={errors}
			setErrors={setErrors}
			submitNewField={submitNewField}
		/>
	);
}
