import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";
import DashboardDatabase from "../interfaces/DashboardDatabase";

interface DeleteModalProps {
	open: boolean;
	project: DashboardDatabase;
	setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
	deleteProject: (databaseId: string) => Promise<void>;
}

export default function DeleteModal({
	open,
	project,
	setOpenDeleteModal,
	deleteProject,
}: DeleteModalProps) {
	const [input, setInput] = useState("");
	const [deleteable, setDeleteable] = useState(false);

	const handleClose = () => {
		setOpenDeleteModal(false);
		setInput("");
	};

	const handleDelete = () => {
		if (!deleteable) return;
		deleteProject(project._id);
		handleClose();
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target!.value);
		e.target!.value === project.slug ? setDeleteable(true) : setDeleteable(false);
	};

	const cancelButtonRef = useRef(null);

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				static
				className="fixed z-10 inset-0 overflow-y-auto"
				initialFocus={cancelButtonRef}
				open={open}
				onClose={handleClose}
			>
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
							<div className="sm:flex sm:items-start">
								<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
									<TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
								</div>
								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
										Delete Project
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											Are you sure you want to delete this project? All of your data will be
											permanently removed from our servers forever. This action cannot be undone.
										</p>
									</div>
								</div>
							</div>
							<div className="mt-12 mb-3 text-center text-base text-gray-500">
								<p>
									Confirm by typing{" "}
									<span className="inline-block text-red-600 font-semibold">{project.slug}</span>{" "}
									below.
								</p>
							</div>
							<div>
								<label htmlFor="input" className="sr-only">
									Input
								</label>
								<div className="mt-1">
									<input
										type="text"
										name="input"
										id="input"
										value={input}
										className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
										placeholder={project.slug}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<button
									type="button"
									className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
										deleteable ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-auto"
									} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm`}
									onClick={handleDelete}
								>
									Delete
								</button>
								<button
									type="button"
									className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
									onClick={handleClose}
									ref={cancelButtonRef}
								>
									Cancel
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
