import React from "react";
import { FaAsterisk } from "react-icons/fa";

interface SelectInputProps {
	title: string;
	name: string;
	id: string;
	children: React.ReactNode;
	required?: boolean;
	refer?: React.RefObject<HTMLSelectElement>;
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	value?: string;
}

export default function SelectGroup({
	title,
	name,
	id,
	children,
	required,
	refer,
	onChange,
	value,
}: SelectInputProps) {
	return (
		<>
			<label htmlFor={id} className="flex text-sm font-medium text-gray-900">
				{title}
				{required && <FaAsterisk color="red" className="w-1.5 ml-1.5 inline" />}
			</label>
			<div className="mt-2 mb-2.5 relative rounded-md">
				<select
					className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm pr-10 sm:text-sm border-gray-300 rounded-md"
					name={name}
					id={id}
					ref={refer}
					onChange={onChange}
					value={value}
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
