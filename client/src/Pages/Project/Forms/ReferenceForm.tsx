import React, { useContext, useState } from "react";
import SelectGroup from "../../../components/Form/SelectGroup";
import ProjectCollectionsContext from "../../../context/ProjectCollectionsContext";
import FormErrors from "../../../interfaces/FormErrors";
import FormProps from "../../../interfaces/FormProps";
import StandardForm from "../StandardForm";

export default function ReferenceForm({
	activeField,
	setActiveField,
	submitNewField,
	changeValidationField,
}: FormProps) {
	const [errors, setErrors] = useState<FormErrors>({ name: "", collection: "" });
	const [collections] = useContext(ProjectCollectionsContext);

	const validations = Boolean(activeField!.validations?.collectionId);

	const handleValidationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		changeValidationField?.("collectionId", e.target.value);
	};

	return (
		<StandardForm
			activeField={activeField}
			setActiveField={setActiveField}
			errors={errors}
			setErrors={setErrors}
			submitNewField={submitNewField}
			validations={validations}
		>
			<SelectGroup
				title="Collection"
				name="collectionId"
				id="validationCollectionId"
				onChange={handleValidationChange}
				value={activeField?.validations?.collectionId}
				required
			>
				<SelectGroup.Option>Select a collection to reference...</SelectGroup.Option>
				{collections.map((collection) => (
					<SelectGroup.Option key={collection._id} value={collection._id}>
						{collection.name}
					</SelectGroup.Option>
				))}
			</SelectGroup>
		</StandardForm>
	);
}
