import React, { useRef } from "react";
import FormProps from "../../../interfaces/FormProps";
import StandardInput from "../../../components/Form/StandardInput";

export default function BasicForm({
	activeField,
	setActiveField,
	submitNewField,
	changeValidationField,
}: FormProps) {
	const requiredRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		submitNewField();
		setActiveField(null);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setActiveField({ ...activeField!, [e.target!.name]: e.target!.value });
	};

	const handleRequiredChange = () => {
		setActiveField({ ...activeField!, required: requiredRef.current?.checked });
	};

	const handleCancel = () => {
		setActiveField(null);
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
			{/* Required Check */}
			<div className="mt-3 mb-1 font-normal text-sm">
				<label>
					<input
						className="focus:ring-indigo-500 h-4 w-4 mr-3 text-indigo-600 border-gray-300 rounded"
						type="checkbox"
						id="fieldRequired"
						name="required"
						ref={requiredRef!}
						onChange={handleRequiredChange}
					/>
					<label htmlFor="fieldRequired">This field is required</label>
				</label>
			</div>
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
					onClick={handleSubmit}
				>
					Save Field
				</button>
			</div>
		</div>
	);
}
