export default function DateIcon({ className }: { className?: string }) {
	return (
		<svg
			data-icon="FieldDateSmall"
			aria-hidden="true"
			focusable="false"
			width="15"
			height="15"
			viewBox="0 0 15 15"
			className={className}
		>
			<path
				fill="currentColor"
				d="M13 3h-1V1h-2v2H5V1H3v2H2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM3 12V7h9v5H3z"
			></path>
		</svg>
	);
}
