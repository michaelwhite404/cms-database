import React from "react";
import NumberInput from "../../../components/Form/NumberInput";
import StandardRadioGroup from "../../../components/Form/StandardRadioGroup";
import StandardInput from "../Slideover/StandardInput";

export default function PlainTextForm() {
	return (
		<div className="mt-4">
			{/* Text input for field name */}
			<StandardInput title="Label" name="fieldName" value={""} handleChange={() => {}} required />
			{/* Test input for field helpText */}
			<StandardInput
				className="mt-5"
				title="Help Text"
				name="helpText"
				value={""}
				helpText="Appears below the label to guide Collaborators, just like this help text"
				handleChange={() => {}}
			/>
			{/* Radio input for single or multiple line */}
			<StandardRadioGroup className="mt-5" title="Text Field Type" name="singleName">
				<StandardRadioGroup.Option value="singleLine" defaultChecked>
					Single Line - {<span className="text-gray-400">For short text</span>}
				</StandardRadioGroup.Option>
				<StandardRadioGroup.Option value="multipleLine">
					Multiple Line - {<span className="text-gray-400">For long text</span>}
				</StandardRadioGroup.Option>
			</StandardRadioGroup>
			{/* Inputs for min and max length */}
			<div className="mt-5 grid grid-cols-2 gap-x-10">
				<NumberInput
					title="Minimum Character Count"
					id="minCount"
					name="minLength"
					value={2}
					placeholder="E.g. 25"
				/>
				<NumberInput
					title="Maximum Character Count"
					id="maxCount"
					name="maxLength"
					placeholder="E.g. 140"
				/>
			</div>
			{/* Save and cancel buttons */}
			<div className="flex justify-end xs:mt-4 absolute right-3 top-3">
				<button
					type="button"
					className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					onClick={() => {}}
				>
					Cancel
				</button>
				<button
					type="button"
					className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					onClick={() => {}}
				>
					Save Field
				</button>
			</div>
		</div>
	);
}
