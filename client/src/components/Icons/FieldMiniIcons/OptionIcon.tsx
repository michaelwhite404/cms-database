export default function OptionIcon({ className }: { className?: string }) {
	return (
		<svg
			data-icon="FieldOptionSmall"
			aria-hidden="true"
			focusable="false"
			width="14"
			height="13"
			viewBox="0 0 14 13"
			className={className}
		>
			<path
				fill="currentColor"
				d="M12 1H2c-.5 0-1 .5-1 1v9c0 .5.5 1 1 1h10c.5 0 1-.5 1-1V2c0-.5-.5-1-1-1zM7 9.4L3.3 5.7l1.4-1.4L7 6.6l2.3-2.3 1.4 1.4L7 9.4z"
			></path>
		</svg>
	);
}
