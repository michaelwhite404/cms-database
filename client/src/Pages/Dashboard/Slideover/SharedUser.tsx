import React from "react";
import SelectMenu from "../../../components/SelectMenu";

interface SharedUserProps {
	person: {
		name: string;
		email: string;
		href: string;
		imageUrl: string;
	};
}

export default function SharedUser({ person }: SharedUserProps) {
	return (
		<div className="flex items-center">
			<img className="inline-block h-8 w-8 rounded-full" src={person.imageUrl} alt={person.name} />
			<div className="pl-3 flex flex-col">
				<div className="font-medium">{person.name}</div>
				<div className="font-normal text-sm text-gray-500">{person.email}</div>
			</div>
			<div className="ml-auto">
				<SelectMenu />
			</div>
		</div>
	);
}
