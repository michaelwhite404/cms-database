export default function OptionButtonIcon({ color }: { color?: string }) {
	return (
		<svg
			data-icon="FieldOption"
			aria-hidden="true"
			focusable="false"
			width="57"
			height="26"
			viewBox="0 0 57 26"
			color={color}
		>
			<path
				fill="currentColor"
				d="M25 12H10v2h15v-2zM54.1 1H2.9C1.9 1 1 1.9 1 2.9v20.2c0 1 .9 1.9 1.9 1.9h51.2c1.1 0 1.9-.9 1.9-1.9V2.9c0-1-.9-1.9-1.9-1.9zm0 22.1H2.9V2.9h51.2v20.2zm-5.5-11.4l-1.1-1.3-2.9 2.5-2.9-2.5-1.1 1.3 4.1 3.5 3.9-3.5z"
			></path>
		</svg>
	);
}
