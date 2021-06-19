import { useState } from "react";
import FormErrors from "../../../interfaces/FormErrors";
import FormProps from "../../../interfaces/FormProps";
import StandardForm from "../StandardForm";

export default function RichTextForm({ activeField, setActiveField, submitNewField }: FormProps) {
	const initialErrors = { name: "", minLength: "", maxLength: "" };
	const [errors, setErrors] = useState<FormErrors>(initialErrors);
	return (
		<StandardForm
			activeField={activeField}
			setActiveField={setActiveField}
			errors={errors}
			setErrors={setErrors}
			submitNewField={submitNewField}
		></StandardForm>
	);
}
