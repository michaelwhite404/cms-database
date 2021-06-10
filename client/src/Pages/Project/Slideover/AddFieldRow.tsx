import { ArrowCircleDownIcon, PlusIcon, XIcon } from "@heroicons/react/solid";
import { useEffect, useRef, useState } from "react";
import PlainTextButtonIcon from "../../../components/Icons/Buttons/PlainTextButtonIcon";
import RichTextButtonIcon from "../../../components/Icons/Buttons/RichTextButtonIcon";
import PlainTextIcon from "../../../components/Icons/PlainTextIcon";
import FieldTypeButton from "./FieldTypeButton";

export default function AddFieldRow() {
	const [active, setActive] = useState(false);
	const [fieldSelected, setFieldSelected] = useState(false);
	const myRef = useRef<HTMLDivElement>();

	const handleClick = () => {
		if (!active) {
			setActive(true);
		}
	};

	useEffect(() => {
		active && myRef.current!.scrollIntoView({ behavior: "smooth" });
	}, [active]);

	const fieldButtons = [
		{ name: "Plain Text", type: "PlainText", icon: PlainTextButtonIcon },
		{ name: "Rich Text", type: "RichText", icon: RichTextButtonIcon },
	];

	return (
		<div
			className={`py-2.5 px-4 text-xs text-gray-700 relative ${!active && "hover:bg-gray-50"}`}
			style={{ userSelect: "none" }}
			// @ts-ignore
			ref={myRef}
			onClick={handleClick}
		>
			<div className="flex items-center font-semibold">
				{!active && (
					<span className="flex items-center text-purple-600">
						<PlusIcon className="mr-3" width={16} />
						<span className="mr-3">Add Field</span>
					</span>
				)}
				{active && !fieldSelected && (
					<>
						<ArrowCircleDownIcon className="mr-3" width={16} />
						<span className="mr-3">Select Field Type</span>
						<button
							className="flex text-gray-400 ml-auto focus:outline-none hover:text-gray-500"
							onClick={() => setActive(false)}
						>
							<XIcon className="mr-1.5 " width={16} />
							Cancel
						</button>
					</>
				)}
			</div>
			{active && (
				<div className="grid grid-cols-6 gap-4 mt-5">
					{fieldButtons.map((field) => (
						<FieldTypeButton name={field.name} Icon={field.icon} />
					))}
				</div>
			)}
		</div>
	);
}
