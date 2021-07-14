import React from "react";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { FaAsterisk } from "react-icons/fa";
import { InputProps } from "../../interfaces/InputProps";
import ErrorTooltip from "../ErrorTooltip";
import "./ColorInput.css";

interface ColorInputProps extends InputProps {
	className?: string;
	value: string;
	helpText?: string;
	placeholder?: string;
	errorMessage?: string;
	focus?: boolean;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ColorInput({
	name,
	title,
	id,
	required,
	className,
	value,
	helpText,
	placeholder,
	errorMessage,
	focus,
	handleChange,
}: ColorInputProps) {
	const [open, setOpen] = useState(false);
	const [color, setColor] = useState(value);
	const triggerColorPicker = () => {
		setOpen(true);
	};

	return (
		<div className="w-72 relative">
			{open && (
				<div className="picker-wrapper">
					<HexColorPicker color={color} onChange={setColor} />
				</div>
			)}
			<label htmlFor={id || name} className="flex text-sm font-medium text-gray-900 ">
				{title}
				{required && <FaAsterisk color="red" className="w-1.5 ml-1.5 inline" />}
			</label>
			{helpText && <div className="text-gray-500 text-xs mt-1">{helpText}</div>}
			<div className="relative mt-2 mb-2.5">
				<input
					type="text"
					name={name}
					id={id || name}
					className={`${
						errorMessage
							? "border-red-500 focus:ring-red-500 focus:border-red-500"
							: "focus:ring-indigo-500 focus:border-indigo-500"
					} block pl-12 w-full shadow-sm sm:text-sm error border-gray-300 rounded-md`}
					autoComplete="off"
					placeholder={placeholder}
					value={color}
					onChange={handleChange}
					autoFocus={focus}
				/>
				{errorMessage && <ErrorTooltip>{errorMessage}</ErrorTooltip>}
				<div
					className="absolute  h-full w-7"
					style={{
						backgroundColor: color,
						top: "0.5px",
						left: "0.5px",
						height: "calc(100% - 1px)",
						borderRadius: "5px 0px 0px 5px",
						width: "37px",
					}}
					onClick={triggerColorPicker}
				></div>
			</div>
		</div>
	);
}
