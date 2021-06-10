import React from "react";

export default function DateButtonIcon({ color }: { color?: string }) {
	return (
		<svg
			data-icon="FieldDate"
			aria-hidden="true"
			focusable="false"
			width="38"
			height="36"
			viewBox="0 0 38 36"
			color={color}
		>
			<path fill="currentColor" fill-opacity=".25" d="M3 6h32v8H3z"></path>
			<path
				fill="currentColor"
				d="M35 4h-7V1h-2v3H12V1h-2v3H3c-1.1 0-2 .9-2 2v27c0 1.1.9 2 2 2h32c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM3 6h7v3h2V6h14v3h2V6h7v8H3V6zm32 27H3V16h32v17z"
			></path>
		</svg>
	);
}
