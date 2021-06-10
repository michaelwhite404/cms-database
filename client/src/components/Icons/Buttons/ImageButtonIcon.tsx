import React from "react";

export default function ImageButtonIcon({ color }: { color?: string }) {
	return (
		<svg
			data-icon="FieldImage"
			aria-hidden="true"
			focusable="false"
			width="48"
			height="48"
			viewBox="0 0 48 48"
			color={color}
		>
			<path
				fill="currentColor"
				d="M42 8H6c-1.1 0-2 .9-2 2v27c0 1.1.9 2 2 2h36c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM7.414 37L16 28.414 24.586 37H7.414zm20 0l-5.8-5.802 6.868-6.776L40.612 37h-13.2.002zM42 35.56L28.518 21.577l-8.32 8.206L16 25.586l-10 10V10h36v25.56zM16 16a2.003 2.003 0 012 2 2.003 2.003 0 01-2 2 2.003 2.003 0 01-2-2 2.003 2.003 0 012-2z"
			></path>
		</svg>
	);
}
