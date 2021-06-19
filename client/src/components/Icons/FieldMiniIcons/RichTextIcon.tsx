import React from "react";

export default function RichTextIcon({ className }: { className?: string }) {
	return (
		<svg
			data-icon="FieldRichtextSmall"
			aria-hidden="true"
			focusable="false"
			width="15"
			height="12"
			viewBox="0 0 15 12"
			className={className}
		>
			<path
				fill="currentColor"
				d="M9 1v2h5V1H9zm0 6h5V5H9v2zm-7 4h12V9H2v2zm5-4.8V1.8c0-.44-.36-.8-.8-.8H1.8c-.44 0-.8.36-.8.8v4.4c0 .44.36.8.8.8h4.4c.44 0 .8-.36.8-.8z"
			></path>
		</svg>
	);
}
