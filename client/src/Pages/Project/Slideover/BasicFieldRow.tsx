import React, { useEffect, useRef, useState } from "react";
import { CollectionDataFields } from "../../../../../src/interfaces/collectionDataInterfaces";
import PlainTextIcon from "../../../components/Icons/FieldMiniIcons/PlainTextIcon";
import StandardForm from "../StandardForm";

interface BasicFieldRowProps {
	field: CollectionDataFields;
	active: boolean;
	activeField: CollectionDataFields | null;
	setActiveField: React.Dispatch<React.SetStateAction<CollectionDataFields | null>>;
	submitField: (tempId: string) => void;
}

export default function BasicFieldRow({
	field,
	active,
	activeField,
	setActiveField,
	submitField,
}: BasicFieldRowProps) {
	const [errors, setErrors] = useState({ name: "" });
	const myRef = useRef<HTMLDivElement>(null);

	const handleClick = () => !active && setActiveField(field);

	useEffect(() => {
		active && myRef.current!.scrollIntoView({ behavior: "smooth" });
	}, [active]);

	// const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
	// 	e.preventDefault();
	// 	submitField(field.tempId);
	// 	setActiveField(null);
	// };

	return (
		<div
			className="border-b py-2.5 px-4 text-xs text-gray-700 relative"
			style={{ userSelect: "none" }}
			ref={myRef}
			onClick={handleClick}
		>
			<div className="flex items-center">
				<PlainTextIcon className="mr-3" />
				<span className="mr-3">{field.name}</span>
				<span className="text-gray-400">(Plain Text)</span>
			</div>
			{active && (
				<StandardForm
					activeField={activeField}
					setActiveField={setActiveField}
					errors={errors}
					setErrors={setErrors}
					//@ts-ignore
					submitNewField={() => submitField(field.tempId)}
					disableRequired
				/>
			)}
		</div>
	);
}
