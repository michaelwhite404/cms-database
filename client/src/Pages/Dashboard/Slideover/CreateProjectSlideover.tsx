import { Dialog } from "@headlessui/react";
import { XIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { MailIcon } from "@heroicons/react/solid";
import axios from "axios";
import React, { useState } from "react";
import { APIUserByEmailRes } from "../../../interfaces/APIResponse";
import DashboardDatabase from "../../../interfaces/DashboardDatabase";
import ISharedUser from "../../../interfaces/ISharedUser";
import SharedUser from "./SharedUser";

interface CreateProjectSlideover {
	projects: DashboardDatabase[];
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setProjects: React.Dispatch<React.SetStateAction<DashboardDatabase[]>>;
}

export default function CreateProjectSlidover({
	setOpen,
	projects,
	setProjects,
}: CreateProjectSlideover) {
	const [projectDetails, setProjectDetails] = useState({ name: "", description: "" });
	const [shareEmail, setShareEmail] = useState("");
	const [users, setUsers] = useState<ISharedUser[]>([]);

	const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			/* const database =  */ await axios.post("/api/v1/databases", projectDetails);
			// const newProjects = [...projects];
			// enw
		} catch (err) {
			console.log(err.response.data);
		}
	};

	const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => {
		setProjectDetails({ ...projectDetails, [e.target!.name]: e.target!.value });
	};

	const handleShareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShareEmail(e.target!.value);
	};

	const handleShareSubmit = async () => {
		if (!shareEmail) return;
		const res = await axios.get<APIUserByEmailRes>(`/api/v1/users/email/${shareEmail}`);
		const user = res.data.user;
		setUsers([
			{
				_id: user._id,
				name: user.name,
				email: user.email,
				imageUrl: `https://ui-avatars.com/api/?background=ffb300&name=${
					user.name.split(" ")[0]
				}&length=1&color=ffffff`,
				role: "editor",
			},
			...users,
		]);
		setShareEmail("");
	};

	const handleRoleChange = (userId: string, role: "editor" | "viewer") => {
		const usersList = users.map((user) => (user._id === userId ? { ...user, role } : user));
		setUsers(usersList);
	};

	return (
		<form
			className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
			onSubmit={handleDetailsSubmit}
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
							Get started by filling in the information below to create your new project.
						</p>
					</div>
				</div>
				<div className="flex-1 flex flex-col justify-between">
					<div className="px-4 divide-y divide-gray-200 sm:px-6">
						<div className="space-y-6 pt-6 pb-5">
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-gray-900">
									Project name
								</label>
								<div className="mt-1">
									<input
										type="text"
										name="name"
										id="name"
										className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
										autoComplete="off"
										onChange={handleDetailsChange}
										value={projectDetails.name}
									/>
								</div>
							</div>
							<div>
								<label htmlFor="description" className="block text-sm font-medium text-gray-900">
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
										onChange={handleDetailsChange}
										value={projectDetails.description}
									/>
								</div>
							</div>
							<div>
								<label htmlFor="users" className="block text-sm font-medium text-gray-900">
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
											onChange={handleShareChange}
										/>
									</div>
									<button
										type="button"
										className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
										onClick={handleShareSubmit}
									>
										<PlusCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
										<span>Add</span>
									</button>
								</div>
								<div className="mt-4">
									<div className="flex flex-col space-y-2 ">
										{users.map((person) => (
											<SharedUser
												person={person}
												key={person.email}
												handleRoleChange={handleRoleChange}
											/>
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
	);
}
