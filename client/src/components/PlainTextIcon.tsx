import React from "react";

export default function PlainTextIcon({ className }: { className?: string }) {
	return (
		<svg
			data-icon="FieldTextSmall"
			aria-hidden="true"
			focusable="false"
			width="12"
			height="12"
			viewBox="0 0 12 12"
			className={className}
		>
			<path fill="currentColor" d="M9 3v1h2V1H1v3h2V3h2v6.02H4V11h4V9.02H7V3z"></path>
		</svg>
	);
}
