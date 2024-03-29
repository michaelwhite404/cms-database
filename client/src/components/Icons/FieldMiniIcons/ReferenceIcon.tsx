export default function ReferenceIcon({ className }: { className?: string }) {
	return (
		<svg
			data-icon="FieldItemrefSmall"
			aria-hidden="true"
			focusable="false"
			width="19"
			height="14"
			viewBox="0 0 19 14"
			className={className}
		>
			<path
				fill="currentColor"
				d="M16.73 6.36c-1.145.414-2.644.64-4.224.64s-3.08-.226-4.222-.64a5.1 5.1 0 01-1.272-.642v1.308c0 1.094 2.46 1.98 5.494 1.98S18 8.12 18 7.026V5.72c-.34.243-.768.46-1.27.64zM1.01 10l4-3-4-3v6z"
			></path>
			<path
				opacity=".5"
				fill="currentColor"
				d="M12.506 11c-1.58 0-3.08-.226-4.222-.64a5.168 5.168 0 01-1.272-.64v1.302c0 1.092 2.46 1.98 5.494 1.98C15.54 13 18 12.11 18 11.02v-1.3a5.25 5.25 0 01-1.27.64c-1.145.414-2.644.64-4.224.64zm0-10c-3.035 0-5.494.887-5.494 1.98v.055c0 1.094 2.46 1.98 5.494 1.98S18 4.128 18 3.035V2.98C18 1.887 15.54 1 12.506 1z"
			></path>
		</svg>
	);
}
