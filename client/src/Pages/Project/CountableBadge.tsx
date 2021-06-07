import { PencilIcon } from "@heroicons/react/solid";
import React from "react";
import capitalize from "../../utils/capitalize";

interface CountableBadgeProps {
	name: string;
	type: "singular" | "plural";
	margin?: boolean;
}

export default function CountableBadge({ name, type, margin }: CountableBadgeProps) {
	return (
		<div
			className={`${
				margin && "ml-3"
			} group p-1 text-xs border inline-block shadow-sm border-gray-300 rounded-md bg-gray-100`}
		>
			<span className="text-gray-500">{capitalize(type)} version: </span>
			<span /* contentEditable={true} */ className="focus:outline-none">{name}</span>
			<span className="ml-1 relative bottom-0.5">
				<PencilIcon className="hidden w-3 group-hover:inline-block" />
			</span>
		</div>
	);
}
