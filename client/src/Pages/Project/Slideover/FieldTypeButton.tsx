import React from "react";

interface FieldTypeButtonProps {
	name: string;
	Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
}

export default function FieldTypeButton({ name, Icon }: FieldTypeButtonProps) {
	return (
		<button
			type="button"
			className="grid place-items-center p-1 bg-gray-50 rounded-lg border-2 focus:outline-none hover:bg-gray-100"
			style={{ gridTemplateRows: "75px 25px" }}
		>
			<Icon color="#7c3aed" />
			<div>{name}</div>
		</button>
	);
}
