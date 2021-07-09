import React from "react";
import { FaAsterisk } from "react-icons/fa";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import ErrorTooltip from "../ErrorTooltip";
import { InputProps } from "../../interfaces/InputProps";
interface NumberInputProps extends InputProps {
	value?: string | number;
	placeholder?: string;
	errorMessage?: string;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	arrows?: boolean;
	increment: () => void;
	decrement: () => void;
}

const buttonTrackStyles: React.CSSProperties = {
	backgroundColor: "#f5f5f5",
	top: "1px",
	right: "0.5px",
	height: "calc(100% - 2px)",
	borderRadius: "0px 5px 5px 0px",
};

export default function NumberInput({
	title,
	id,
	placeholder,
	value,
	name,
	required,
	errorMessage,
	handleChange,
	arrows,
	increment,
	decrement,
}: NumberInputProps) {
	return (
		<div>
			<label htmlFor={id} className="flex text-sm font-medium text-gray-900 ">
				{title}
				{required && <FaAsterisk color="red" className="w-1.5 ml-1.5 inline" />}
			</label>
			<div className="mt-2 relative rounded-md">
				<input
					type="text"
					name={name}
					id={id}
					className={`${
						errorMessage
							? "border-red-500 focus:ring-red-500 focus:border-red-500"
							: "focus:ring-indigo-500 focus:border-indigo-500"
					} block w-full shadow-sm pr-10 sm:text-sm border-gray-300 rounded-md`}
					autoComplete="off"
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					onBlur={() => {}}
				/>
				{errorMessage && <ErrorTooltip>{errorMessage}</ErrorTooltip>}
				<div
					className={`${
						!arrows && "hidden"
					} absolute grid grid-rows-2 grid-cols-1 right-0.5 top-0.5 bottom-0.5 h-full w-6 border-l`}
					style={buttonTrackStyles}
				>
					<div
						className="flex items-center justify-center hover:bg-gray-200 cursor-pointer"
						onClick={increment}
					>
						<AiFillCaretUp color="#6b6b6b" />
					</div>
					<div
						className="flex items-center justify-center border-t border-gray-300 hover:bg-gray-200 cursor-pointer"
						onClick={decrement}
					>
						<AiFillCaretDown color="#6b6b6b" />
					</div>
				</div>
			</div>
		</div>
	);
}
