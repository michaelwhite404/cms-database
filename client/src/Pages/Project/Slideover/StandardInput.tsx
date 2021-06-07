interface StandardInputProps {
	title: string;
	name: string;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleBlur?: () => void;
	value: string;
}

export default function StandardInput({
	title,
	name,
	value,
	handleChange,
	handleBlur,
}: StandardInputProps) {
	return (
		<>
			<label htmlFor={name} className="block text-sm font-medium text-gray-900">
				{title}
			</label>
			<div className="mt-2 mb-2.5">
				<input
					type="text"
					name={name}
					id={name}
					className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
					autoComplete="off"
					placeholder="E.g. Blog Posts"
					value={value}
					onChange={handleChange}
					onBlur={handleBlur}
				/>
			</div>
			{/* {children} */}
		</>
	);
}
