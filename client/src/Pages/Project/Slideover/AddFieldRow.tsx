import { ArrowCircleDownIcon, PlusIcon, XIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";
import FieldTypeButton from "./FieldTypeButton";
import ButtonIcon from "../../../components/Icons/ButtonIcon";
import PlainTextIcon from "../../../components/Icons/PlainTextIcon";
import PlainTextForm from "../Forms/PlainTextForm";

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
		{ name: "Plain Text", type: "PlainText", icon: ButtonIcon.PlainText },
		{ name: "Rich Text", type: "RichText", icon: ButtonIcon.RichText },
		{ name: "Image", type: "Image", icon: ButtonIcon.Image },
		{ name: "Video Link", type: "Video", icon: ButtonIcon.Video },
		{ name: "Link", type: "Link", icon: ButtonIcon.Link },
		{ name: "Email", type: "Email", icon: ButtonIcon.Email },
		{ name: "Phone", type: "Phone", icon: ButtonIcon.Phone },
		{ name: "Number", type: "Number", icon: ButtonIcon.Number },
		{ name: "Date", type: "Date", icon: ButtonIcon.Date },
		{ name: "Switch", type: "Bool", icon: ButtonIcon.Bool },
		{ name: "Color", type: "Color", icon: ButtonIcon.Color },
		{ name: "Option", type: "Option", icon: ButtonIcon.Option },
		// { name: "File", type: "File", icon: ButtonIcon.File },
		{ name: "Reference", type: "ItemRef", icon: ButtonIcon.Reference },
		{ name: "Multi Reference", type: "ItemRefMulti", icon: ButtonIcon.MultiReference },
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
				{active &&
					(!fieldSelected ? (
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
					) : (
						<>
							<PlainTextIcon className="mr-3" />
							<span className="mr-3">New Field</span>
							<span className="text-gray-400">(Plain Text)</span>
						</>
					))}
			</div>
			{active &&
				(!fieldSelected ? (
					<div className="grid grid-cols-6 gap-4 mt-5 mb-2.5">
						{fieldButtons.map((field) => (
							<FieldTypeButton
								key={field.type}
								name={field.name}
								Icon={field.icon}
								setFieldSelected={setFieldSelected}
							/>
						))}
					</div>
				) : (
					<PlainTextForm />
				))}
		</div>
	);
}