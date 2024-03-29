import React from "react";

export default function VideoButtonIcon({ color }: { color?: string }) {
	return (
		<svg
			data-icon="FieldVideo"
			aria-hidden="true"
			focusable="false"
			width="42"
			height="33"
			viewBox="0 0 42 33"
			color={color}
		>
			<path
				fill="currentColor"
				d="M38 1H4C2.35 1 1 2.35 1 4v25c0 1.65 1.35 3 3 3h34c1.65 0 3-1.35 3-3V4c0-1.65-1.35-3-3-3zm1 28c0 .542-.458 1-1 1H4c-.542 0-1-.458-1-1V4c0-.542.458-1 1-1h34c.542 0 1 .458 1 1v25zM19.117 11.328L16 9.528V23.47l3.123-1.8 5.85-3.452 2.912-1.72-2.874-1.718-5.89-3.452zM18 19.953v-6.907l5.8 3.453-5.8 3.45z"
			></path>
		</svg>
	);
}
