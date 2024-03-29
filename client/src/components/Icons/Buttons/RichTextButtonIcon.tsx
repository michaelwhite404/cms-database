import React from "react";

export default function RichTextButtonIcon({ color }: { color?: string }) {
	return (
		<svg
			data-icon="FieldRichText"
			aria-hidden="true"
			focusable="false"
			width="51"
			height="32"
			viewBox="0 0 51 32"
			color={color}
		>
			<path
				fill="currentColor"
				d="M9 6a2 2 0 100 4 2 2 0 000-4zm16 11V3c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2zM3 17V3h20v10.586l-5-5L9.586 17H3zm15-5.586l5 5V17H12.414L18 11.414zM28 5v2h22V5H28zm0 8h22v-2H28v2zm0 6h22v-2H28v2zM4 25h46v-2H4v2zm0 6h31v-2H4v2z"
			></path>
		</svg>
	);
}
