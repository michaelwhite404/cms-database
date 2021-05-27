import { Menu, Transition } from "@headlessui/react";
import {
	DotsVerticalIcon,
	DuplicateIcon,
	PencilAltIcon,
	TrashIcon,
	UserAddIcon,
} from "@heroicons/react/solid";
import { Fragment } from "react";
import MenuItem from "./MenuItem";

const primaryOptions = [
	{ name: "Edit", icon: PencilAltIcon },
	{ name: "Duplicate", icon: DuplicateIcon },
	{ name: "Share", icon: UserAddIcon },
];

export default function ProjectOptions() {
	return (
		<Menu as="div" className="relative flex justify-end items-center">
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
							className="mx-3 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-10 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
						>
							<div className="py-1">
								{primaryOptions.map((option) => (
									<MenuItem name={option.name} Icon={option.icon} />
								))}
							</div>
							<div className="py-1">
								<MenuItem name="Delete" Icon={TrashIcon} />
							</div>
						</Menu.Items>
					</Transition>
				</>
			)}
		</Menu>
	);
}
