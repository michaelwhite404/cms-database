import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { ClockIcon, HomeIcon, MenuAlt1Icon, ViewListIcon, XIcon } from "@heroicons/react/outline";
import {
	ChevronRightIcon,
	DotsVerticalIcon,
	DuplicateIcon,
	PencilAltIcon,
	SearchIcon,
	SelectorIcon,
	TrashIcon,
	UserAddIcon,
	CodeIcon,
} from "@heroicons/react/solid";
import Main from "./Main";
import SidebarSearch from "./SidebarSearch";
import classNames from "../utils/classNames";
import UserAccountDropdown from "./UserAccountDropdown";

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

export default function Example() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="h-screen flex overflow-hidden bg-white">
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog
					as="div"
					static
					className="fixed inset-0 flex z-40 lg:hidden"
					open={sidebarOpen}
					onClose={setSidebarOpen}
				>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
					</Transition.Child>
					<Transition.Child
						as={Fragment}
						enter="transition ease-in-out duration-300 transform"
						enterFrom="-translate-x-full"
						enterTo="translate-x-0"
						leave="transition ease-in-out duration-300 transform"
						leaveFrom="translate-x-0"
						leaveTo="-translate-x-full"
					>
						<div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
							<Transition.Child
								as={Fragment}
								enter="ease-in-out duration-300"
								enterFrom="opacity-0"
								enterTo="opacity-100"
								leave="ease-in-out duration-300"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<div className="absolute top-0 right-0 -mr-12 pt-2">
									<button
										className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
										onClick={() => setSidebarOpen(false)}
									>
										<span className="sr-only">Close sidebar</span>
										<XIcon className="h-6 w-6 text-white" aria-hidden="true" />
									</button>
								</div>
							</Transition.Child>
							<div className="flex-shrink-0 flex items-center px-4">
								<img
									className="h-8 w-auto"
									src="https://tailwindui.com/img/logos/workflow-logo-purple-500-mark-gray-700-text.svg"
									alt="Workflow"
								/>
							</div>
							<div className="mt-5 flex-1 h-0 overflow-y-auto">
								<nav className="px-2">
									<div className="space-y-1">
										{navigation.map((item) => (
											<a
												key={item.name}
												href={item.href}
												className={classNames(
													item.current
														? "bg-gray-100 text-gray-900"
														: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
													"group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md"
												)}
												aria-current={item.current ? "page" : undefined}
											>
												<item.icon
													className={classNames(
														item.current
															? "text-gray-500"
															: "text-gray-400 group-hover:text-gray-500",
														"mr-3 h-6 w-6"
													)}
													aria-hidden="true"
												/>
												{item.name}
											</a>
										))}
									</div>
									<div className="mt-8">
										<h3
											className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
											id="teams-headline"
										>
											Teams
										</h3>
										<div className="mt-1 space-y-1" role="group" aria-labelledby="teams-headline">
											{teams.map((team) => (
												<a
													key={team.name}
													href={team.href}
													className="group flex items-center px-3 py-2 text-base leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
												>
													<span
														className={classNames(
															team.bgColorClass,
															"w-2.5 h-2.5 mr-4 rounded-full"
														)}
														aria-hidden="true"
													/>
													<span className="truncate">{team.name}</span>
												</a>
											))}
										</div>
									</div>
								</nav>
							</div>
						</div>
					</Transition.Child>
					<div className="flex-shrink-0 w-14" aria-hidden="true">
						{/* Dummy element to force sidebar to shrink to fit close icon */}
					</div>
				</Dialog>
			</Transition.Root>

			{/* Static sidebar for desktop */}
			<div className="hidden lg:flex lg:flex-shrink-0">
				<div className="flex flex-col w-64 border-r border-gray-200 pt-5 pb-4 bg-gray-100">
					<div className="flex items-center flex-shrink-0 px-6">
						<img
							className="h-8 w-auto"
							src="https://tailwindui.com/img/logos/workflow-logo-purple-500-mark-gray-700-text.svg"
							alt="Workflow"
						/>
					</div>
					{/* Sidebar component, swap this element with another sidebar if you like */}
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
				</div>
			</div>

			<Main open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
		</div>
	);
}
