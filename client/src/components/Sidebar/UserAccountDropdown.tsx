import { Menu, Transition } from "@headlessui/react";
import { SelectorIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import MenuItem from "../MenuItem";

const profileMenu = {
	first: ["View Profile", "Settings", "Notifications"],
	second: ["Get desktop app", "Support"],
	third: ["Logout"],
};

export default function UserAccountDropdown() {
	return (
		<Menu as="div" className="px-3 mt-6 relative inline-block text-left">
			{({ open }) => (
				<>
					<div>
						<Menu.Button className="group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500">
							<span className="flex w-full justify-between items-center">
								<span className="flex min-w-0 items-center justify-between space-x-3">
									<img
										className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
										src="https://images.unsplash.com/photo-1567290329751-0700a37da0af?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
										alt="User Profile"
									/>
									<span className="flex-1 flex flex-col min-w-0">
										<span className="text-gray-900 text-sm font-medium truncate">
											Michael White
										</span>
										<span className="text-gray-500 text-sm truncate">@mikewhite</span>
									</span>
								</span>
								<SelectorIcon
									className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
									aria-hidden="true"
								/>
							</span>
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
							className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
						>
							<div className="py-1">
								{profileMenu.first.map((item) => (
									<MenuItem name={item} />
								))}
							</div>
							<div className="py-1">
								{profileMenu.second.map((item) => (
									<MenuItem name={item} />
								))}
							</div>
							<div className="py-1">
								{profileMenu.third.map((item) => (
									<MenuItem name={item} />
								))}
							</div>
						</Menu.Items>
					</Transition>
				</>
			)}
		</Menu>
	);
}
