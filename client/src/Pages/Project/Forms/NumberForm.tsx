import React, { useRef, useState } from "react";
import NumberInput from "../../../components/Form/NumberInput";
import FormProps from "../../../interfaces/FormProps";
import StandardInput from "../../../components/Form/StandardInput";
import SelectGroup from "../../../components/Form/SelectGroup";

export default function NumberForm({
	activeField,
	setActiveField,
	submitNewField,
	changeValidationField,
}: FormProps) {
	const [errors /* setErrors */] = useState({
		name: "",
		minimum: "",
		maximum: "",
	});
	const requiredRef = useRef<HTMLInputElement>(null);
	const precisonRef = useRef<HTMLSelectElement>(null);

	/*const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		submitNewField();
		setActiveField(null);
	}; */

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setActiveField({ ...activeField!, [e.target!.name]: e.target!.value });
	};

	const handleArrowChange = (
		operator: "increment" | "decrement",
		name: string,
		currentValue: string
	) => {
		const choice = { increment: 1, decrement: -1 };
		let newValue = operator === "increment" ? 1 : 0;
		if (!isNaN(Number(currentValue))) {
			newValue = Number(currentValue) + choice[operator];
		}
		changeValidationField?.(name, Number(newValue));
	};

	const handleNumberValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let { name, value }: { value: any; name: string } = e.target;
		if (value !== "" && !isNaN(Number(value))) value = Number(value);
		changeValidationField?.(name, value);
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
			<div className="mt-5 grid grid-cols-2 gap-x-10">
				<NumberInput
					title="Minimum Number"
					id="minNumber"
					name="minimum"
					value={activeField!.validations!.minimum}
					handleChange={handleNumberValidationChange}
					arrows
					increment={() =>
						handleArrowChange("increment", "minimum", `${activeField!.validations!.minimum}`)
					}
					decrement={() =>
						handleArrowChange("decrement", "minimum", `${activeField!.validations!.minimum}`)
					}
					errorMessage={errors.minimum}
				/>
				<NumberInput
					title="Maximum Number"
					id="maxNumber"
					name="maximum"
					value={activeField!.validations!.maximum}
					handleChange={handleNumberValidationChange}
					arrows
					increment={() =>
						handleArrowChange("increment", "maximum", `${activeField!.validations!.maximum}`)
					}
					decrement={() =>
						handleArrowChange("decrement", "maximum", `${activeField!.validations!.maximum}`)
					}
					errorMessage={errors.maximum}
				/>
			</div>
			{/** Format Option Dropdown */}
			<div className="mt-4">
				<SelectGroup title="Format" name="format" id="numberFormat">
					<SelectGroup.Option value="integer">Integer (1)</SelectGroup.Option>
					<SelectGroup.Option value="decimal">Decimal (1.0)</SelectGroup.Option>
					<SelectGroup.Option>Any Format</SelectGroup.Option>
				</SelectGroup>
			</div>
			{/** Precision Option Dropdown */}
			<div className="mt-4">
				<SelectGroup title="Precision" name="decimalPlaces" id="decimalPlaces" refer={precisonRef}>
					<SelectGroup.Option value="1">1.0</SelectGroup.Option>
					<SelectGroup.Option value="2">1.00</SelectGroup.Option>
					<SelectGroup.Option value="3">1.000</SelectGroup.Option>
					<SelectGroup.Option value="4">1.0000</SelectGroup.Option>
					<SelectGroup.Option value="5">1.00000</SelectGroup.Option>
				</SelectGroup>
			</div>
		</div>
	);
}
