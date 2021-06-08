import { PencilIcon } from "@heroicons/react/solid";
import React from "react";
import MiniBadge from "../../components/MiniBadge";
import capitalize from "../../utils/capitalize";

interface CountableBadgeProps {
	name: string;
	type: "singular" | "plural";
	margin?: boolean;
}

export default function CountableBadge({ name, type, margin }: CountableBadgeProps) {
	return (
		<MiniBadge margin={margin}>
			<>
				<span className="text-gray-500" style={{ userSelect: "none" }}>
					{capitalize(type)} version:{" "}
				</span>
				<span /* contentEditable={true} */ className="focus:outline-none">{name}</span>
				<span className="ml-1 relative bottom-0.5">
					<PencilIcon className="hidden w-3 group-hover:inline-block" />
				</span>
			</>
		</MiniBadge>
	);
}
