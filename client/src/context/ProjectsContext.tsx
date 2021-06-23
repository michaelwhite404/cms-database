import axios from "axios";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { APIDashboardResponse } from "../interfaces/APIResponse";
import DashboardDatabase from "../interfaces/DashboardDatabase";

type ProjectsC = {
	projects: DashboardDatabase[];
	setProjects: React.Dispatch<React.SetStateAction<DashboardDatabase[]>>;
	getProject: (projectId: string) => DashboardDatabase;
	pinnedProjects: DashboardDatabase[];
};

const ProjectsContext = createContext<ProjectsC>({} as ProjectsC);
export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
	const [projects, setProjects] = useState<DashboardDatabase[]>([]);

	const fetchProjects = async () => {
		try {
			const res = await axios.get<APIDashboardResponse>("/api/v1/ui/dashboard");
			setProjects(res.data.databases);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	const pinnedProjects = projects.filter((project) => project.pinned);

	const getProject = (projectSlug: string) => projects.find((p) => p.slug === projectSlug)!;

	return (
		<ProjectsContext.Provider value={{ projects, setProjects, getProject, pinnedProjects }}>
			{children}
		</ProjectsContext.Provider>
	);
};

export default ProjectsContext;
