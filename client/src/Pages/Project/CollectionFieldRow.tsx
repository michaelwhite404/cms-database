import React from "react";
import { CollectionField } from "../../../../src/interfaces/collectionInterfaces";
import PlainTextIcon from "../../components/PlainTextIcon";
import fieldTypeToText from "../../utils/fieldTypeToText";

interface CollectionFieldRowProps {
	name: CollectionField["name"];
	type: CollectionField["type"];
	required?: CollectionField["required"];
}

export default function CollectionFieldRow({ name, type, required }: CollectionFieldRowProps) {
	return (
		<div
			className="flex items-center border-b py-2.5 px-4 text-xs text-gray-700"
			style={{ userSelect: "none" }}
		>
			<PlainTextIcon className="mr-3" />
			<span className="mr-3">{name}</span>
			<span className="text-gray-400">({fieldTypeToText[type]})</span>
			{required && <span className="text-gray-400 ml-auto">Required Field</span>}
		</div>
	);
}
