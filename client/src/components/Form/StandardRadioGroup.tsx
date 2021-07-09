import React from "react";
import { FaAsterisk } from "react-icons/fa";
import { InputProps } from "../../interfaces/InputProps";

interface StandardRadioGroupProps extends InputProps {
	className?: string;
	children: React.ReactNode;
}

export default function StandardRadioGroup({
	title,
	className,
	name,
	children,
	required,
}: StandardRadioGroupProps): JSX.Element {
	const newChildren = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, { name });
		}
		return child;
	});

	return (
		<fieldset className={className}>
			<legend className="text-sm mb-1 font-medium text-gray-900">{title}</legend>
			{required && <FaAsterisk color="red" className="w-1.5 ml-1.5 inline" />}
			<div className="mt-2 space-y-3">{newChildren}</div>
		</fieldset>
	);
}

interface StandardRadioGroupOptionProps {
	name?: string;
	value: string;
	// id?: string;
	defaultChecked?: boolean;
	children: React.ReactNode;
	onChange: () => void;
}

StandardRadioGroup.Option = ({
	name,
	value,
	defaultChecked,
	children,
	onChange,
}: StandardRadioGroupOptionProps) => {
	return (
		<div className="relative flex items-start" style={{ minHeight: 20 }}>
			<label>
				<div className="absolute flex items-center h-5">
					<input
						id={`${value}Option`}
						name={name}
						type="radio"
						className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
						defaultChecked={defaultChecked}
						value={value}
						onChange={onChange}
					/>
				</div>
				<div className="pl-7 text-sm">
					<label htmlFor={`${value}Option`} className="font-normal text-gray-900">
						{children}
					</label>
				</div>
			</label>
		</div>
	);
};
