export default function BoolIcon({ className }: { className?: string }) {
	return (
		<svg
			data-icon="FieldSwitchSmall"
			aria-hidden="true"
			focusable="false"
			width="16"
			height="11"
			viewBox="0 0 16 11"
			className={className}
		>
			<path
				fill="currentColor"
				d="M10.414 1H5.586C3.064 1 1 3.025 1 5.5S3.064 10 5.586 10h4.83C12.936 10 15 7.975 15 5.5S12.936 1 10.414 1zM5.5 8a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
			></path>
		</svg>
	);
}
