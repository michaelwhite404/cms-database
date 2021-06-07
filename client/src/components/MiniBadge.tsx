import React from "react";

interface MiniBadgeProps {
	children: JSX.Element;
	margin?: boolean;
}

export default function MiniBadge({ children, margin }: MiniBadgeProps) {
	return (
		<div
			className={`${
				margin && "ml-3"
			} group p-1 text-xs border inline-block shadow-sm border-gray-300 rounded-md bg-gray-100`}
		>
			{children}
		</div>
	);
}
