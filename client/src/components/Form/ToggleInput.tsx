import { useState } from "react";
import { Switch } from "@headlessui/react";
import classNames from "../../utils/classNames";
import { FaAsterisk } from "react-icons/fa";

interface ToggleInputProps {
	id: string;
	name: string;
	title: string;
	required: boolean;
}

export default function ToggleInput({ id, name, title, required }: ToggleInputProps) {
	const [enabled, setEnabled] = useState(false);

	return (
		<>
			<label htmlFor={id || name} className="flex text-sm font-medium text-gray-900 ">
				{title}
				{required && <FaAsterisk color="red" className="w-1.5 ml-1.5 inline" />}
			</label>
			<Switch
				checked={enabled}
				onChange={setEnabled}
				className={classNames(
					enabled ? "bg-indigo-600" : "bg-gray-200",
					"relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				)}
			>
				<span className="sr-only">Toggle</span>
				<span
					aria-hidden="true"
					className={classNames(
						enabled ? "translate-x-5" : "translate-x-0",
						"pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
					)}
				/>
			</Switch>
		</>
	);
}
