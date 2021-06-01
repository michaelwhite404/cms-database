import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { MailIcon } from "@heroicons/react/solid";
import SelectMenu from "./SelectMenu";
import axios from "axios";
import SharedUser from "../Pages/Dashboard/Slideover/SharedUser";

const team = [
	{
		name: "Tom Cook",
		email: "tomcook@example.com",
		href: "#",
		imageUrl:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
	{
		name: "Whitney Francis",
		email: "whitneyfrancis@example.com",
		href: "#",
		imageUrl:
			"https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
	{
		name: "Leonard Krasner",
		email: "leonardkrasner@example.com",
		href: "#",
		imageUrl:
			"https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
	/* {
		name: "Floyd Miles",
		email: "floydmiles@example.com",
		href: "#",
		imageUrl:
			"https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
	{
		name: "Emily Selman",
		email: "emilyselman@example.com",
		href: "#",
		imageUrl:
			"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	}, */
];

interface SlideoverProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault();
};

export default function Slideover({ open, setOpen }: SlideoverProps) {
	const [shareEmail, setShareEmail] = useState("");
	const [users, setUsers] = useState(team);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShareEmail(e.target!.value);
	};

	const handleShareSubmit = async () => {
		if (!shareEmail) return;
		const res = await axios.get(`/api/v1/users/email/${shareEmail}`);
		const user = res.data.user;
		setUsers([
			{
				name: user.fullName,
				email: user.email,
				href: "#",
				imageUrl: `https://ui-avatars.com/api/?background=ffb300&name=${user.fullName}&length=1&color=ffffff`,
			},
			...users,
		]);
		setShareEmail("");
	};
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				static
				className="fixed inset-0 overflow-hidden"
				open={open}
				onClose={setOpen}
			>
				<div className="absolute inset-0 overflow-hidden">
					<Transition.Child
						as={Fragment}
						enter="ease-in-out duration-500"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in-out duration-500"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>
					<div className="fixed lg:inset-y-0 top-16 bottom-0 pl-16 max-w-full right-0 flex">
						<Transition.Child
							as={Fragment}
							enter="transform transition ease-in-out duration-500 sm:duration-700"
							enterFrom="translate-x-full"
							enterTo="translate-x-0"
							leave="transform transition ease-in-out duration-500 sm:duration-700"
							leaveFrom="translate-x-0"
							leaveTo="translate-x-full"
						>
							<div className="w-screen max-w-md">
								<form
									className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
									onSubmit={handleSubmit}
								>
									<div className="flex-1 h-0 overflow-y-auto">
										<div className="py-6 px-4 bg-indigo-700 sm:px-6">
											<div className="flex items-center justify-between">
												<Dialog.Title className="text-lg font-medium text-white">
													Create New Project
												</Dialog.Title>
												<div className="ml-3 h-7 flex items-center">
													<button
														type="button"
														className="bg-indigo-700 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
														onClick={() => setOpen(false)}
													>
														<span className="sr-only">Close panel</span>
														<XIcon className="h-6 w-6" aria-hidden="true" />
													</button>
												</div>
											</div>
											<div className="mt-1">
												<p className="text-sm text-indigo-300">
													Get started by filling in the information below to create your new
													project.
												</p>
											</div>
										</div>
										<div className="flex-1 flex flex-col justify-between">
											<div className="px-4 divide-y divide-gray-200 sm:px-6">
												<div className="space-y-6 pt-6 pb-5">
													<div>
														<label
															htmlFor="project_name"
															className="block text-sm font-medium text-gray-900"
														>
															Project name
														</label>
														<div className="mt-1">
															<input
																type="text"
																name="project_name"
																id="project_name"
																className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
																autoComplete="off"
															/>
														</div>
													</div>
													<div>
														<label
															htmlFor="description"
															className="block text-sm font-medium text-gray-900"
														>
															Description
														</label>
														<div className="mt-1">
															<textarea
																id="description"
																name="description"
																rows={4}
																className="block w-full min-h-64 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
																defaultValue={""}
																maxLength={256}
															/>
														</div>
													</div>
													<div>
														<label
															htmlFor="users"
															className="block text-sm font-medium text-gray-900"
														>
															Share With
														</label>
														<div className="mt-2 flex rounded-md shadow-sm">
															<div className="relative flex items-stretch flex-grow focus-within:z-10">
																<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
																	<MailIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
																</div>
																<input
																	type="text"
																	name="email"
																	id="email"
																	value={shareEmail}
																	className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
																	placeholder="example@email.com"
																	onChange={handleChange}
																/>
															</div>
															<button
																type="button"
																className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
																onClick={handleShareSubmit}
															>
																<PlusCircleIcon
																	className="h-5 w-5 text-gray-400"
																	aria-hidden="true"
																/>
																<span>Add</span>
															</button>
														</div>
														<div className="mt-4">
															<div className="flex flex-col space-y-2 ">
																{users.map((person) => (
																	<SharedUser person={person} key={person.email} />
																))}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="flex-shrink-0 px-4 py-4 flex justify-end">
										<button
											type="button"
											className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
											onClick={() => setOpen(false)}
										>
											Cancel
										</button>
										<button
											type="submit"
											className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
										>
											Save
										</button>
									</div>
								</form>
							</div>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
