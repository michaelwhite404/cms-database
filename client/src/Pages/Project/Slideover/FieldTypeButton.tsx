import React from "react";

interface FieldTypeButtonProps {
	name: string;
	Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
	setFieldSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FieldTypeButton({ name, Icon, setFieldSelected }: FieldTypeButtonProps) {
	return (
		<button
			type="button"
			className="grid place-items-center p-1 bg-gray-50 rounded-lg shadow-md focus:outline-none hover:bg-gray-100"
			style={{ gridTemplateRows: "75px 25px" }}
			onClick={() => setFieldSelected(true)}
		>
			<Icon color="#7c3aed" />
			<div>{name}</div>
		</button>
	);
}
