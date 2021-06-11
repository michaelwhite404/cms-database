import { FaAsterisk } from "react-icons/fa";

interface StandardInputProps {
	title: string;
	name: string;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleBlur?: () => void;
	value: string;
	id?: string;
	required?: boolean;
	className?: string;
	placeholder?: string;
	helpText?: string;
}

export default function StandardInput({
	title,
	name,
	value,
	id,
	handleChange,
	handleBlur,
	required,
	className,
	placeholder,
	helpText,
}: StandardInputProps) {
	return (
		<div className={className}>
			<label htmlFor={id || name} className="flex text-sm font-medium text-gray-900 ">
				{title}
				{required && <FaAsterisk color="red" className="w-1.5 ml-1.5 inline" />}
			</label>
			{helpText && <div className="text-gray-500 text-xs mt-1">{helpText}</div>}
			<div className="mt-2 mb-2.5">
				<input
					type="text"
					name={name}
					id={id || name}
					className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
					autoComplete="off"
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					onBlur={handleBlur}
				/>
			</div>
		</div>
	);
}
