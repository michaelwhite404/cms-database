import { Dialog } from "@headlessui/react";
import { LinkIcon, XIcon } from "@heroicons/react/solid";
import pluralize from "pluralize";
import React, { useState } from "react";
import slugify from "slugify";
import MiniBadge from "../../components/MiniBadge";
import CountableBadge from "./CountableBadge";

interface CreateCollectionSlideoverProps {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateCollectionSlideover({ setOpen }: CreateCollectionSlideoverProps) {
	const [newCollectionData, setNewCollectionData] = useState({
		name: "",
		slug: "",
		pluralName: "Items",
		singularName: "Item",
		fields: [],
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setNewCollectionData({
			...newCollectionData,
			name,
			slug: slugify(name, { lower: true }),
			pluralName: pluralize(name) || "Items",
			singularName: pluralize.singular(name) || "Item",
		});
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement & HTMLSpanElement>) => {
		setNewCollectionData({ ...newCollectionData, [e.target!.name]: e.target!.value });
	};

	return (
		<form
			className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
			onSubmit={handleSubmit}
		>
			<div className="flex-1 h-0 overflow-y-auto">
				<div className="py-6 px-4 bg-indigo-700 sm:px-6">
					<div className="flex items-center justify-between">
						<Dialog.Title className="text-lg font-medium text-white">
							Create New Collection
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
				<div className="flex-1 flex flex-col justify-between divide-y divide-gray-200 py-4">
					<div className="px-4 sm:px-6">
						<h3 className="text-2xl font-semibold">Collection Settings</h3>
						<div className="space-y-6 pt-6 pb-5">
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-gray-900">
									Collection Name
								</label>
								<div className="mt-2 mb-2.5">
									<input
										type="text"
										name="name"
										id="name"
										className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
										autoComplete="off"
										placeholder="E.g. Blog Posts"
										value={newCollectionData.name}
										onChange={handleNameChange}
									/>
								</div>
								<div>
									<CountableBadge name={newCollectionData.singularName} type="singular" />
									<CountableBadge name={newCollectionData.pluralName} type="plural" margin />
								</div>
							</div>
						</div>
						<div>
							<label htmlFor="slug" className="block text-sm font-medium text-gray-900">
								Collection URL
							</label>
							<div className="mt-2 mb-2.5">
								<input
									type="text"
									name="slug"
									id="slug"
									className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
									autoComplete="off"
									placeholder="E.g. posts"
									value={newCollectionData.slug}
									onChange={handleChange}
									onBlur={() =>
										setNewCollectionData({
											...newCollectionData,
											slug: slugify(newCollectionData.slug, { lower: true }),
										})
									}
								/>
							</div>
							<div>
								<MiniBadge>
									<span className="flex text-gray-500">
										<LinkIcon className="w-3 mr-2 ml-1" />
										<span>mywebsite.com/</span>
										<span className="text-indigo-600">
											{newCollectionData.slug ||
												slugify(newCollectionData.name, { lower: true }) ||
												"items"}
										</span>
										<span>{`/${slugify(newCollectionData.singularName, {
											lower: true,
										})}-page`}</span>
									</span>
								</MiniBadge>
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
