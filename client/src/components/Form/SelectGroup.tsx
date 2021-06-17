import React from "react";

interface SelectInputProps {
	title: string;
	name: string;
	id: string;
	children: React.ReactNode;
	refer?: React.RefObject<HTMLSelectElement>;
}

export default function SelectGroup({ title, name, id, children, refer }: SelectInputProps) {
	return (
		<>
			<label htmlFor={id} className="flex text-sm font-medium text-gray-900">
				{title}
			</label>
			<div className="mt-2 mb-2.5 relative rounded-md">
				<select
					className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm pr-10 sm:text-sm border-gray-300 rounded-md"
					name={name}
					id={id}
					ref={refer}
				>
					{children}
				</select>
			</div>
		</>
	);
}

SelectGroup.Option = ({ value, children }: { value?: string; children: string }) => {
	return <option value={value || ""}>{children}</option>;
};
