import React from "react";

interface CheckboxProps {
	children: string;
	id: string;
	name: string;
	refer?: React.RefObject<HTMLInputElement>;
	checked?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({ children, id, name, refer, onChange, checked }: CheckboxProps) {
	return (
		<div className="mt-3 mb-1 font-normal text-sm">
			<label>
				<input
					className="focus:ring-indigo-500 h-4 w-4 mr-3 text-indigo-600 border-gray-300 rounded"
					type="checkbox"
					id={id}
					name={name}
					ref={refer}
					onChange={onChange}
					checked={checked}
				/>
				{<label htmlFor={id}>{children}</label>}
			</label>
		</div>
	);
}
