/* eslint-disable react-hooks/exhaustive-deps */
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import axios from "axios";
import React, { Fragment, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { APIDashboardResponse } from "../../interfaces/APIResponse";
import classNames from "../../utils/classNames";
import MenuItem from "../MenuItem";

export default function PinnedProject({
	project,
	removePin,
}: {
	project: APIDashboardResponse["databases"][0];
	removePin: (database_id: string) => any;
}) {
	const history = useHistory();
	const pinnedProjectsOptions = {
		first: [
			{
				name: "View",
				onClick: useCallback(() => history.push(`/databases/${project.slug}`), [history]),
			},
		],
		second: [
			{
				name: "Remove from pinned",
				onClick: useCallback(() => removePin(project._id), []),
			},
			{ name: "Share" },
		],
	};

	return (
		<div>
			<li key={project._id} className="relative col-span-1 flex shadow-sm rounded-md">
				<div
					className={classNames(
						/* project.bgColorClass */ "bg-pink-600",
						"flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
					)}
				>
					{/* {project.initials} */}
				</div>
				<div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
					<div className="flex-1 px-4 py-2 text-sm truncate">
						<Link
							to={`/databases/${project.slug}`}
							className="text-gray-900 font-medium hover:text-gray-600"
						>
							{project.name}
						</Link>
						<p className="text-gray-500">{project.totalUsers} Users</p>
					</div>
					<Menu as="div" className="flex-shrink-0 pr-2">
						{({ open }) => (
							<>
								<Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
									<span className="sr-only">Open options</span>
									<DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
								</Menu.Button>
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
										className="z-10 mx-3 origin-top-right absolute right-10 top-3 w-48 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
									>
										<div className="py-1">
											{pinnedProjectsOptions.first.map((option) => (
												<MenuItem name={option.name} onClick={option.onClick} />
											))}
										</div>
										<div className="py-1">
											{pinnedProjectsOptions.second.map((option) => (
												<MenuItem name={option.name} onClick={option.onClick} />
											))}
										</div>
									</Menu.Items>
								</Transition>
							</>
						)}
					</Menu>
				</div>
			</li>
		</div>
	);
}
