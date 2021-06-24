import classNames from "../../utils/classNames";
import SidebarSearch from "./SidebarSearch";
import UserAccountDropdown from "./UserAccountDropdown";
import { ClockIcon, CodeIcon, HomeIcon, ViewListIcon } from "@heroicons/react/outline";
import { useContext } from "react";
import ProjectsContext from "../../context/ProjectsContext";
import { Link, useRouteMatch } from "react-router-dom";

export default function Sidebar() {
	const match = useRouteMatch();
	const isCurrent = (url: string) => match.url === url;
	const navigation = [
		{ name: "Dashboard", href: "/dashboard", icon: HomeIcon },
		{ name: "Documentation", href: "#", icon: CodeIcon },
		{ name: "My tasks", href: "#", icon: ViewListIcon },
		{ name: "Recent", href: "#", icon: ClockIcon },
	];

	const { pinnedProjects } = useContext(ProjectsContext);

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
						<Link
							key={item.name}
							to={item.href}
							className={classNames(
								isCurrent(item.href)
									? "bg-gray-200 text-gray-900"
									: "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
								"group flex items-center px-2 py-2 text-sm font-medium rounded-md"
							)}
							aria-current={isCurrent(item.href) ? "page" : undefined}
						>
							<item.icon
								className={classNames(
									isCurrent(item.href)
										? "text-gray-500"
										: "text-gray-400 group-hover:text-gray-500",
									"mr-3 h-6 w-6"
								)}
								aria-hidden="true"
							/>
							{item.name}
						</Link>
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
						{pinnedProjects.map((project) => (
							<Link
								key={project._id}
								to={`/databases/${project.slug}`}
								className={classNames(
									isCurrent(`/databases/${project.slug}`)
										? "bg-gray-200 text-gray-900"
										: "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
									"group flex items-center px-2 py-2 text-sm font-medium rounded-md"
								)}
							>
								<span
									className={classNames("bg-pink-500", "w-2.5 h-2.5 mr-4 rounded-full")}
									aria-hidden="true"
								/>
								<span className="truncate">{project.name}</span>
							</Link>
						))}
					</div>
				</div>
			</nav>
		</div>
	);
}
