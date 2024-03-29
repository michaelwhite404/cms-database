export default function ImageIcon({ className }: { className?: string }) {
	return (
		<svg
			data-icon="FieldImageSmall"
			aria-hidden="true"
			focusable="false"
			width="15"
			height="12"
			viewBox="0 0 15 12"
			className={className}
		>
			<path
				fill="currentColor"
				d="M13 1H2c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zM3 4.5C3 3.675 3.675 3 4.5 3S6 3.675 6 4.5 5.325 6 4.5 6 3 5.325 3 4.5zM12 9H5l4.5-4.44L12 7.028V9z"
			></path>
		</svg>
	);
}
