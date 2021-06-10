import React from "react";

interface StandardRadioGroupProps {
	/** Title of the radio group (text goes inside the `legend` tag) */
	title: string;
	className?: string;
	name: string;
	children: React.ReactNode;
}

export default function StandardRadioGroup({
	title,
	className,
	name,
	children,
}: StandardRadioGroupProps): JSX.Element {
	const newChildren = React.Children.map(children, (child) => {
		// checking isValidElement is the safe way and avoids a typescript error too
		if (React.isValidElement(child)) {
			return React.cloneElement(child, { name });
		}
		return child;
	});

	return (
		<fieldset className={className}>
			<legend className="text-sm mb-1 font-medium text-gray-900">{title}</legend>
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
}

StandardRadioGroup.Option = ({
	name,
	value,
	defaultChecked,
	children,
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
					/>
				</div>
				<div className="pl-7 text-sm">
					<label htmlFor={`${value}Option`} className="font-medium text-gray-900">
						{children}
					</label>
				</div>
			</label>
		</div>
	);
};
