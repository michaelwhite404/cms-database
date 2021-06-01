/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import SelectMenu from "../../../components/SelectMenu";
import ISharedUser from "../../../interfaces/ISharedUser";

interface SharedUserProps {
	person: ISharedUser;
	handleRoleChange: (userId: string, role: "editor" | "viewer") => void;
}

const statuses: { name: string; value: "editor" | "viewer" }[] = [
	{ name: "Editor", value: "editor" },
	{ name: "Viewer", value: "viewer" },
];

export default function SharedUser({ person, handleRoleChange }: SharedUserProps) {
	const [selectedRole, setSelectedRole] = useState(statuses[0]);

	useEffect(() => {
		handleRoleChange(person._id, selectedRole.value);
	}, [selectedRole]);
	return (
		<div className="flex items-center">
			<img className="inline-block h-8 w-8 rounded-full" src={person.imageUrl} alt={person.name} />
			<div className="pl-3 flex flex-col">
				<div className="font-medium">{person.name}</div>
				<div className="font-normal text-sm text-gray-500">{person.email}</div>
			</div>
			<div className="ml-auto">
				<SelectMenu selected={selectedRole} setSelected={setSelectedRole} />
			</div>
		</div>
	);
}
