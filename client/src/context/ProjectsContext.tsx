import axios from "axios";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { APIDashboardResponse } from "../interfaces/APIResponse";
import DashboardDatabase from "../interfaces/DashboardDatabase";

type ProjectsC = {
	projects: DashboardDatabase[];
	setProjects: React.Dispatch<React.SetStateAction<DashboardDatabase[]>>;
	pinnedProjects: DashboardDatabase[];
};

const ProjectsContext = createContext<ProjectsC>({
	projects: [],
	setProjects: () => {},
	pinnedProjects: [],
});
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

	return (
		<ProjectsContext.Provider value={{ projects, setProjects, pinnedProjects }}>
			{children}
		</ProjectsContext.Provider>
	);
};

export default ProjectsContext;
