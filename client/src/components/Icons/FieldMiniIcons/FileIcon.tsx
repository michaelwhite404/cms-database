export default function FileIcon({ className }: { className?: string }) {
	return (
		<svg
			data-icon="FileSmall"
			aria-hidden="true"
			focusable="false"
			width="14"
			height="14"
			viewBox="0 0 14 14"
			className={className}
		>
			<path
				d="M2.654 11.328A2.8 2.8 0 012.65 7.39l5.21-5.254a.914.914 0 011.31-.006.93.93 0 010 1.315L3.957 8.7a.934.934 0 000 1.314.916.916 0 001.303 0l5.213-5.256a2.8 2.8 0 000-3.94A2.746 2.746 0 006.558.82L1.345 6.078a4.67 4.67 0 00.005 6.565 4.586 4.586 0 006.52-.004l5.86-5.91a.934.934 0 000-1.314.916.916 0 00-1.303 0l-5.86 5.908a2.754 2.754 0 01-3.913.004z"
				fill="currentColor"
			></path>
		</svg>
	);
}
