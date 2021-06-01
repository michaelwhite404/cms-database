import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import React, { Fragment } from "react";
import classNames from "../utils/classNames";

const statuses = [
	{ name: "Editor", value: "editor" },
	{ name: "Viewer", value: "viewer" },
];

interface SelectMenuProps {
	selected: { name: string; value: "editor" | "viewer" };
	setSelected: React.Dispatch<
		React.SetStateAction<{
			name: string;
			value: "editor" | "viewer";
		}>
	>;
}

export default function SelectMenu({ selected, setSelected }: SelectMenuProps) {
	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					<div className="mt-1 relative">
						<Listbox.Button className="bg-white relative w-full border border-white rounded-md pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
							<span className="block truncate">{selected.name}</span>
							<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
								<ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options
								static
								className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
							>
								{statuses.map((status) => (
									<Listbox.Option
										key={status.value}
										className={({ active }) =>
											classNames(
												active ? "text-white bg-indigo-600" : "text-gray-900",
												"cursor-default select-none relative py-2 pl-3 pr-9"
											)
										}
										value={status}
									>
										{({ selected, active }) => (
											<>
												<span
													className={classNames(
														selected ? "font-semibold" : "font-normal",
														"block truncate"
													)}
												>
													{status.name}
												</span>

												{selected ? (
													<span
														className={classNames(
															active ? "text-white" : "text-indigo-600",
															"absolute inset-y-0 right-0 flex items-center pr-4"
														)}
													>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
}
