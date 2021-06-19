import React, { useContext } from "react";
import slugify from "slugify";
import { CollectionDataFields } from "../../../../src/interfaces/collectionDataInterfaces";
import Checkbox from "../../components/Form/Checkbox";
import StandardInput from "../../components/Form/StandardInput";
import NewCollectionContext from "../../context/NewCollectionContext";
import FormErrors from "../../interfaces/FormErrors";

interface StandardFormProps {
	activeField: CollectionDataFields | null;
	setActiveField: React.Dispatch<React.SetStateAction<CollectionDataFields | null>>;
	errors: FormErrors;
	setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
	submitNewField: () => void;
	disableRequired?: boolean;
	children?: React.ReactNode;
}

export default function StandardForm({
	activeField,
	setActiveField,
	errors,
	setErrors,
	submitNewField,
	disableRequired,
	children,
}: StandardFormProps) {
	const [newCollectionData] = useContext(NewCollectionContext);
	const currentFields = newCollectionData.fields;
	const submittable = !Object.values(errors).join("").length && activeField!.name;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const slugLow = (value: string) => slugify(value, { lower: true });
		const duplicate = currentFields
			.filter((f) => f.tempId !== activeField!.tempId)
			.map((f) => slugLow(f.name))
			.includes(slugLow(value));
		if (name === "name")
			if (value.length === 0) setErrors({ ...errors, name: "This field is required" });
			else if (duplicate) setErrors({ ...errors, name: "Already Exists" });
			else setErrors({ ...errors, name: "" });
		setActiveField({ ...activeField!, [name]: value });
	};

	const handleCancel = () => {
		setActiveField(null);
	};

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!activeField!.name) setErrors({ ...errors, name: "This field is required" });
		if (!submittable) return;
		submitNewField();
		setActiveField(null);
	};

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target;
		setActiveField({ ...activeField!, [name]: checked });
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
			{children}
			{/* Required Check */}
			{!disableRequired && (
				<Checkbox
					id="fieldRequired"
					name="required"
					onChange={handleCheckboxChange}
					checked={activeField?.required}
				>
					This field is required
				</Checkbox>
			)}
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
