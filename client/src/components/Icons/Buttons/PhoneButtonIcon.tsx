export default function PhoneButtonIcon({ color }: { color?: string }) {
	return (
		<svg
			data-icon="FieldPhone"
			aria-hidden="true"
			focusable="false"
			width="35"
			height="36"
			viewBox="0 0 35 36"
			color={color}
		>
			<path
				fill="currentColor"
				d="M33.1 5.5l-9.4-3.7-5.4 10.6 4.3 4.5c-1.8 2.5-4.1 4.8-6.6 6.6L11.9 19 .7 24l3.9 10.3.8-.1C20.2 32.9 32 21.3 33.8 6.5l.1-.8-.8-.2zM5.9 32.2l-2.7-7.1 8.1-3.8 4.3 4.7.7-.5c3.3-2.2 6.1-5.1 8.3-8.3l.5-.7-4.5-4.6 3.9-7.7 7 2.8C29.8 20.2 19.2 30.6 5.9 32.2z"
			></path>
		</svg>
	);
}
