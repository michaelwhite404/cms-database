import React from "react";
import StandardRadioGroup from "../../../components/Form/StandardRadioGroup";
import StandardInput from "../Slideover/StandardInput";

export default function PlainTextForm() {
	return (
		<div className="mt-4">
			<StandardInput title="Label" name="name" value={""} handleChange={() => {}} required />
			<StandardInput
				className="mt-5"
				title="Help Text"
				name="helpText"
				value={""}
				helpText="Appears below the label to guide Collaborators, just like this help text"
				handleChange={() => {}}
			/>
			<StandardRadioGroup className="mt-5" title="Test Em" name="singleName">
				<StandardRadioGroup.Option value="singleLine" defaultChecked>
					Single Line - {<span className="text-gray-400">For short text</span>}
				</StandardRadioGroup.Option>
				<StandardRadioGroup.Option value="multipleLine">
					Multiple Line - {<span className="text-gray-400">For long text</span>}
				</StandardRadioGroup.Option>
			</StandardRadioGroup>

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
