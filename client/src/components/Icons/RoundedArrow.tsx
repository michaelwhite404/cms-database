import React from "react";

export default function RoundedArrow(props: React.ComponentProps<"svg">) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={props.width}
			height={props.height}
			viewBox="0 0 24 24"
		>
			<path
				fill="currentColor"
				d="M16 9v-4l8 8-8 8v-4s-13.277-2.144-16-14c5.796 6.206 16 6 16 6z"
			/>
		</svg>
	);
}
