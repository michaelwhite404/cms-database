import React, { useEffect, useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/solid";
import axios from "axios";
import classNames from "../../utils/classNames";
import { APIDashboardResponse } from "../../interfaces/APIResponse";
import PinnedProject from "./PinnedProject";
import DashboardDatabase from "../../interfaces/DashboardDatabase";
import DashboardTableRow from "./DashboardTableRow";
import SearchHeader from "../SearchHeader";
import { Link } from "react-router-dom";

interface MainProps {
	setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setSuccessNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setSuccessMessage: React.Dispatch<React.SetStateAction<[string, (string | undefined)?]>>;
}

export default function Main({
	setSidebarOpen,
	setSuccessNotificationOpen,
	setSuccessMessage,
}: MainProps) {
	const [projects, setProjects] = useState<DashboardDatabase[]>([]);
	const pinnedProjects = projects.filter((project) => project.pinned);
	const fetchProjects = async () => {
		try {
			const res = await axios.get<APIDashboardResponse>("/api/v1/ui/dashboard");
			setProjects(res.data.databases);
		} catch (err) {
			console.log(err);
		}
	};

	const removePin = async (databaseId: string) => {
		try {
			await axios.patch(`/api/v1/databases/roles/pinned/${databaseId}`);
			const index = projects.findIndex((p) => p._id === databaseId);
			if (index < 0) return;
			let editProjects = [...projects];
			editProjects[index].pinned = false;
			setProjects(editProjects);
		} catch (err) {
			console.log(err);
		}
	};

	const deleteProject = async (databaseId: string) => {
		try {
			await axios.delete(`/api/v1/databases/${databaseId}`);
			const newProjects = projects.filter((p) => p._id !== databaseId);
			setSuccessMessage(["Project Deleted Successfully"]);
			setSuccessNotificationOpen(true);
			setTimeout(() => {
				setSuccessNotificationOpen(false);
				setSuccessMessage([""]);
			}, 3500);
			setProjects(newProjects);
		} catch (err) {
			console.log(err.response.data);
		}
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	return (
		<div className="flex flex-col w-0 flex-1 overflow-hidden">
			{/* Search header */}
			<SearchHeader setSidebarOpen={setSidebarOpen} />
			<main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
				{/* Page title & actions */}
				<div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
					<div className="flex-1 min-w-0">
						<h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">Dashboard</h1>
					</div>
					<div className="mt-4 flex sm:mt-0 sm:ml-4">
						<button
							type="button"
							className="order-1 ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-0 sm:ml-0"
						>
							Share
						</button>
						<button
							type="button"
							className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-1 sm:ml-3"
						>
							+ Create New Project
						</button>
					</div>
				</div>
				{/* Pinned projects */}
				<div className="px-4 mt-6 sm:px-6 lg:px-8">
					<h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
						Pinned Projects
					</h2>
					<ul className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-3">
						{pinnedProjects.map((project) => (
							<PinnedProject project={project} removePin={removePin} />
						))}
					</ul>
				</div>

				{/* Projects list (only on smallest breakpoint) */}
				<div className="mt-10 sm:hidden">
					<div className="px-4 sm:px-6">
						<h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Projects</h2>
					</div>
					<ul className="mt-3 border-t border-gray-200 divide-y divide-gray-100">
						{projects.map((project) => (
							<li key={project._id}>
								<Link
									to={`/databases/${project.slug}`}
									className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6"
								>
									<span className="flex items-center truncate space-x-3">
										<span
											className={classNames(
												/* project.bgColorClass */ "bg-pink-600",
												"w-2.5 h-2.5 flex-shrink-0 rounded-full"
											)}
											aria-hidden="true"
										/>
										<span className="font-medium truncate text-sm leading-6">
											{project.name}{" "}
											{/* <span className="truncate font-normal text-gray-500">in {project.team}</span> */}
										</span>
									</span>
									<ChevronRightIcon
										className="ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-500"
										aria-hidden="true"
									/>
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Projects table (small breakpoint and up) */}
				<div className="hidden mt-8 sm:block">
					<div className="align-middle inline-block min-w-full border-b border-gray-200">
						<table className="min-w-full">
							<thead>
								<tr className="border-t border-gray-200">
									<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										<span className="lg:pl-2">Projecttttttttt</span>
									</th>
									<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Members
									</th>
									<th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Last Viewed
									</th>
									<th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-100">
								{projects.map((project) => (
									<DashboardTableRow project={project} deleteProject={deleteProject} />
								))}
							</tbody>
						</table>
					</div>
				</div>
			</main>
		</div>
	);
}
