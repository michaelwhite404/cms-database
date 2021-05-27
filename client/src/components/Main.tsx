import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MenuAlt1Icon } from "@heroicons/react/outline";
import { ChevronRightIcon, SearchIcon } from "@heroicons/react/solid";
import axios from "axios";
import { Link } from "react-router-dom";
import Badge from "./Badge";
import ProjectOptions from "./ProjectOptions";
import classNames from "../utils/classNames";
import { APIDashboardResponse } from "../interfaces/APIResponse";
import PinnedProject from "./PinnedProject";

interface MainProps {
	open: boolean;
	setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Main({ setSidebarOpen }: MainProps) {
	const [projects, setProjects] = useState<APIDashboardResponse["databases"]>([]);
	const pinnedProjects = projects.filter((project) => project.pinned);
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

	return (
		<div className="flex flex-col w-0 flex-1 overflow-hidden">
			{/* Search header */}
			<div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
				<button
					className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
					onClick={() => setSidebarOpen(true)}
				>
					<span className="sr-only">Open sidebar</span>
					<MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
				</button>
				<div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
					<div className="flex-1 flex">
						<form className="w-full flex md:ml-0" action="#" method="GET">
							<label htmlFor="search_field" className="sr-only">
								Search
							</label>
							<div className="relative w-full text-gray-400 focus-within:text-gray-600">
								<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
									<SearchIcon className="h-5 w-5" aria-hidden="true" />
								</div>
								<input
									id="search_field"
									name="search_field"
									className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:text-sm"
									placeholder="Search"
									type="search"
								/>
							</div>
						</form>
					</div>
					<div className="flex items-center">
						{/* Profile dropdown */}
						<Menu as="div" className="ml-3 relative">
							{({ open }) => (
								<>
									<div>
										<Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
											<span className="sr-only">Open user menu</span>
											<img
												className="h-8 w-8 rounded-full"
												src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
												alt=""
											/>
										</Menu.Button>
									</div>
									<Transition
										show={open}
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items
											static
											className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
										>
											<div className="py-1">
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? "bg-gray-100 text-gray-900" : "text-gray-700",
																"block px-4 py-2 text-sm"
															)}
														>
															View profile
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? "bg-gray-100 text-gray-900" : "text-gray-700",
																"block px-4 py-2 text-sm"
															)}
														>
															Settings
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? "bg-gray-100 text-gray-900" : "text-gray-700",
																"block px-4 py-2 text-sm"
															)}
														>
															Notifications
														</a>
													)}
												</Menu.Item>
											</div>
											<div className="py-1">
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? "bg-gray-100 text-gray-900" : "text-gray-700",
																"block px-4 py-2 text-sm"
															)}
														>
															Get desktop app
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? "bg-gray-100 text-gray-900" : "text-gray-700",
																"block px-4 py-2 text-sm"
															)}
														>
															Support
														</a>
													)}
												</Menu.Item>
											</div>
											<div className="py-1">
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? "bg-gray-100 text-gray-900" : "text-gray-700",
																"block px-4 py-2 text-sm"
															)}
														>
															Logout
														</a>
													)}
												</Menu.Item>
											</div>
										</Menu.Items>
									</Transition>
								</>
							)}
						</Menu>
					</div>
				</div>
			</div>
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
							<PinnedProject project={project} />
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
								<a
									href="#"
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
								</a>
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
										Last updated
									</th>
									<th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-100">
								{projects.map((project) => (
									<tr key={project._id}>
										<td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
											<div className="flex items-center space-x-3 lg:pl-2">
												<div
													className={classNames(
														/* project.bgColorClass */ "bg-pink-600",
														"flex-shrink-0 w-2.5 h-2.5 rounded-full"
													)}
													aria-hidden="true"
												/>
												<Link
													to={`/databases/${project.slug}`}
													className="truncate hover:text-gray-600"
												>
													<span>
														{project.name}
														<Badge role={project.role} />
													</span>
												</Link>
											</div>
										</td>
										<td className="px-6 py-3 text-sm text-gray-500 font-medium">
											<div className="flex items-center space-x-2">
												<div className="flex flex-shrink-0 -space-x-1">
													{/* {project.users.map((user) => (
														<img
															key={member.handle}
															className="max-w-none h-6 w-6 rounded-full ring-2 ring-white"
															src={member.imageUrl}
															alt={member.name}
														/>
													))} */}
												</div>
												{/* {project.totalUsers > project.members.length ? ( */}
												<span className="flex-shrink-0 text-xs leading-5 font-medium">
													+{project.totalUsers}
													{/* +{project.totalMembers - project.members.length} */}
												</span>
												{/* ) : null} */}
											</div>
										</td>
										<td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
											{/* {project.lastUpdated} */}
										</td>
										<td className="pr-6">
											<ProjectOptions />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</main>
		</div>
	);
}
