export default function MultiReferenceIcon({ className }: { className?: string }) {
	return (
		<svg
			data-icon="FieldMultirefSmall"
			aria-hidden="true"
			focusable="false"
			width="19"
			height="16"
			viewBox="0 0 19 16"
			className={className}
		>
			<path
				opacity=".5"
				fill="currentColor"
				d="M12.506 8c-1.58 0-3.08-.226-4.222-.64a5.1 5.1 0 01-1.272-.642v1.308c0 1.094 2.46 1.98 5.494 1.98S18 9.12 18 8.026V6.72a5.25 5.25 0 01-1.27.642c-1.145.412-2.644.638-4.224.638z"
			></path>
			<path
				fill="currentColor"
				d="M12.506 12c-1.58 0-3.08-.226-4.222-.64a5.185 5.185 0 01-1.272-.64v1.3c0 1.093 2.46 1.98 5.494 1.98S18 13.113 18 12.02v-1.3a5.25 5.25 0 01-1.27.64c-1.145.414-2.644.64-4.224.64zM1.012 7l4-3-4-3v6zm0 8l4-3-4-3v6zM12.506 2c-3.035 0-5.494.887-5.494 1.98v.055c0 1.094 2.46 1.98 5.494 1.98S18 5.128 18 4.035V3.98C18 2.887 15.54 2 12.506 2z"
			></path>
		</svg>
	);
}
