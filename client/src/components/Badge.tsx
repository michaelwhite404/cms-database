import { DatabaseRoles } from "../../../src/interfaces/databaseRoleInterface";
import capitalize from "../utils/capitalize";

export default function Badge({ role }: { role: DatabaseRoles }) {
	const match = {
		owner: "green",
		editor: "blue",
		viewer: "gray",
	};
	const color = match[role];

	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ml-2 font-medium bg-${color}-100 text-${color}-800`}
		>
			{capitalize(role)}
		</span>
	);
}
