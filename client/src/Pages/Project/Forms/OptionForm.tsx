import { PlusIcon } from "@heroicons/react/solid";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { CollectionValidationOption } from "../../../../../src/interfaces/collectionInterfaces";
import FormErrors from "../../../interfaces/FormErrors";
import FormProps from "../../../interfaces/FormProps";
import StandardForm from "../StandardForm";
import OptionRow from "../Slideover/OptionRow";

export default function OptionForm({
	activeField,
	setActiveField,
	submitNewField,
	changeValidationField,
}: FormProps) {
	const [errors, setErrors] = useState<FormErrors>({ name: "", options: "" });

	const options = activeField!.validations!.options as CollectionValidationOption[];

	/** Add option click handler */
	const handleClick = () => {
		if (options.map((o) => o.name).includes("")) return;
		changeValidationField?.("options", [...options, { _id: uuid(), name: "" }]);
	};

	const changeOptions = (optionsArray: CollectionValidationOption[]) => {
		setActiveField({ ...activeField!, validations: { options: optionsArray } });
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
				<div className="my-6 border shadow-sm border-gray-300 rounded-md overflow-hidden">
					{options.map((option) => (
						<OptionRow
							key={option._id as string}
							id={option._id as string}
							name={option.name}
							options={options}
							changeOptions={changeOptions}
						/>
					))}
					<div className="flex items-center font-semibold w-full h-8 pl-3" onClick={handleClick}>
						<span className="flex items-center text-green-500">
							<PlusIcon className="mr-2" width={16} />
							<span className="mr-3">Add Option</span>
						</span>
					</div>
				</div>
			</StandardForm>
		</div>
	);
}
