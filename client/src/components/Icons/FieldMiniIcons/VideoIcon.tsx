export default function VideoIcon({ className }: { className?: string }) {
	return (
		<svg
			data-icon="FieldVideoSmall"
			aria-hidden="true"
			focusable="false"
			width="16"
			height="11"
			viewBox="0 0 16 11"
			className={className}
		>
			<path
				fill="currentColor"
				d="M14 2l-4 2.8V1H2c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1h8V6.2L14 9h1V2h-1z"
			></path>
		</svg>
	);
}
