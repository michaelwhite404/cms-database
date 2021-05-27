import classNames from "../../utils/classNames";
import SidebarSearch from "./SidebarSearch";
import UserAccountDropdown from "./UserAccountDropdown";
import { ClockIcon, CodeIcon, HomeIcon, ViewListIcon } from "@heroicons/react/outline";

const navigation = [
	{ name: "Dashboard", href: "#", icon: HomeIcon, current: true },
	{ name: "Documentation", href: "#", icon: CodeIcon, current: false },
	{ name: "My tasks", href: "#", icon: ViewListIcon, current: false },
	{ name: "Recent", href: "#", icon: ClockIcon, current: false },
];
const teams = [
	{ name: "Engineering", href: "#", bgColorClass: "bg-indigo-500" },
	{ name: "Human Resources", href: "#", bgColorClass: "bg-green-500" },
	{ name: "Customer Success", href: "#", bgColorClass: "bg-yellow-500" },
];

export default function Sidebar() {
	return (
		<div className="h-0 flex-1 flex flex-col overflow-y-auto">
			{/* User account dropdown */}
			<UserAccountDropdown />
			{/* Sidebar Search */}
			<SidebarSearch />
			{/* Navigation */}
			<nav className="px-3 mt-6">
				<div className="space-y-1">
					{navigation.map((item) => (
						<a
							key={item.name}
							href={item.href}
							className={classNames(
								item.current
									? "bg-gray-200 text-gray-900"
									: "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
								"group flex items-center px-2 py-2 text-sm font-medium rounded-md"
							)}
							aria-current={item.current ? "page" : undefined}
						>
							<item.icon
								className={classNames(
									item.current ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500",
									"mr-3 h-6 w-6"
								)}
								aria-hidden="true"
							/>
							{item.name}
						</a>
					))}
				</div>
				<div className="mt-8">
					{/* Secondary navigation */}
					<h3
						className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
						id="teams-headline"
					>
						Pinned Projects
					</h3>
					<div className="mt-1 space-y-1" role="group" aria-labelledby="teams-headline">
						{teams.map((team) => (
							<a
								key={team.name}
								href={team.href}
								className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
							>
								<span
									className={classNames(team.bgColorClass, "w-2.5 h-2.5 mr-4 rounded-full")}
									aria-hidden="true"
								/>
								<span className="truncate">{team.name}</span>
							</a>
						))}
					</div>
				</div>
			</nav>
		</div>
	);
}
