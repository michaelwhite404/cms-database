import React, { useEffect, useRef, useState } from "react";
import { CollectionField } from "../../../../src/interfaces/collectionInterfaces";
import PlainTextIcon from "../../components/PlainTextIcon";
import fieldTypeToText from "../../utils/fieldTypeToText";
import StandardInput from "./Slideover/StandardInput";

interface CollectionFieldRowProps {
	name: CollectionField["name"];
	type: CollectionField["type"];
	required?: CollectionField["required"];
}

export default function CollectionFieldRow({ name, type, required }: CollectionFieldRowProps) {
	const [active, setActive] = useState(false);
	const myRef = useRef<HTMLDivElement>();
	const handleChange = () => {};

	const handleClick = () => {
		!active && setActive(true);
	};

	useEffect(() => {
		active && myRef.current!.scrollIntoView({ behavior: "smooth" });
	}, [active]);

	return (
		<>
			<div
				className="border-b py-2.5 px-4 text-xs text-gray-700"
				style={{ userSelect: "none" }}
				//@ts-ignore
				ref={myRef}
				onClick={handleClick}
			>
				<div className="flex items-center">
					<PlainTextIcon className="mr-3" />
					<span className="mr-3">{name}</span>
					<span className="text-gray-400">({fieldTypeToText[type]})</span>
					{required && <span className="text-gray-400 ml-auto">Required Field</span>}
				</div>
				{active && (
					<div className="mt-4">
						<StandardInput
							title="Label"
							name="label"
							value={name}
							handleChange={handleChange}
							required
						/>
						<StandardInput
							className="mt-5"
							title="Help Text"
							name="help"
							value=""
							helpText="Appears below the label to guide Collaborators, just like this help text"
							handleChange={handleChange}
						/>
					</div>
				)}
			</div>
		</>
	);
}
