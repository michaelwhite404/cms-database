import { FaAsterisk } from "react-icons/fa";
import Select, { GroupTypeBase, Styles } from "react-select";
import { InputProps } from "../../interfaces/InputProps";
import "./SelectMultiInput.css";

interface Option {
	label: any;
	value: string;
}

interface Props extends InputProps {
	options: Option[];
	defaultValue: Option[];
}

export default function SelectMultiInput({
	title,
	name,
	id,
	required,
	options,
	defaultValue,
}: Props) {
	const styles: Partial<Styles<Option, true, GroupTypeBase<Option>>> = {
		control: (provided, state) => ({
			...provided,
			borderColor: state.isFocused ? "#6366f1" : provided.borderColor,
			boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : provided.boxShadow,
			cursor: "text",
		}),
		clearIndicator: () => ({
			display: "none",
		}),
		indicatorSeparator: () => ({
			display: "none",
		}),
		input: (provided) => ({
			...provided,
			border: "none",
			boxShadow: "none",
		}),
		multiValue: (provided) => ({
			...provided,
			backgroundColor: "#3e8ff6",
			cursor: "default",
			borderRadius: "4px",
		}),
		multiValueLabel: (provided) => ({
			...provided,
			color: "white",
			padding: "2px",
		}),
		multiValueRemove: (provided) => ({
			...provided,
			color: "rgba(255,255,255,0.5)",
			backgroundColor: "transparent",
			":hover": {
				color: "white",
			},
		}),
	};

	return (
		<>
			<label htmlFor={id} className="flex text-sm font-medium text-gray-900">
				{title}
				{required && <FaAsterisk color="red" className="w-1.5 ml-1.5 inline" />}
			</label>
			<div className="mt-2 mb-2.5 relative">
				<Select
					classNamePrefix="react-select"
					closeMenuOnSelect={false}
					defaultValue={defaultValue}
					isMulti
					options={options}
					styles={styles}
				/>
			</div>
		</>
	);
}
