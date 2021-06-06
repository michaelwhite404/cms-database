import React from "react";
import PinnedProject from "./PinnedProject";
import DashboardDatabase from "../../interfaces/DashboardDatabase";

interface PinnedProjectsProps {
	projects: DashboardDatabase[];
	togglePin: (databaseId: string) => Promise<void>;
}

export default function PinnedProjects({ projects, togglePin }: PinnedProjectsProps) {
	return (
		<div className="px-4 mt-6 sm:px-6 lg:px-8">
			<h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Pinned Projects</h2>
			<ul className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-3">
				{projects.map((project) => (
					<PinnedProject project={project} togglePin={togglePin} key={project._id} />
				))}
			</ul>
		</div>
	);
}
