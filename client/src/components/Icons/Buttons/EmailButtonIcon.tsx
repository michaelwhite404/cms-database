export default function EmailButtonIcon({ color }: { color?: string }) {
	return (
		<svg
			data-icon="FieldEmail"
			aria-hidden="true"
			focusable="false"
			width="38"
			height="28"
			viewBox="0 0 38 28"
			color={color}
		>
			<path
				fill="currentColor"
				d="M35.1 1H2.9C1.9 1 1 1.9 1 2.9V25c0 1.1.9 2 1.9 2H35c1.1 0 1.9-.9 1.9-1.9V2.9c.1-1-.8-1.9-1.8-1.9zM2.9 4.2l10.5 9.6-10.5 9.6V4.2zm16.1 12L4.4 2.9h29.3L19 16.2zm-4.1-1.1l4.1 3.7 4.1-3.7 10.9 10H4l10.9-10zm9.6-1.3L35 4.2v19.2l-10.5-9.6z"
			></path>
		</svg>
	);
}
