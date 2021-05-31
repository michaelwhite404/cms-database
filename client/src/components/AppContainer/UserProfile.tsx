import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import SmallProfileMenuItem from "../SmallProfileMenuItem";

const profileMenu = {
	first: ["View Profile", "Settings", "Notifications"],
	second: ["Get desktop app", "Support"],
	third: ["Logout"],
};

export default function UserProfile() {
	return (
		<div className="flex items-center">
			<Menu as="div" className="ml-3 relative">
				{({ open }) => (
					<>
						<div>
							<Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
								<span className="sr-only">Open user menu</span>
								<img
									className="h-8 w-8 rounded-full"
									src="https://images.unsplash.com/photo-1567290329751-0700a37da0af?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
									alt="User Profile"
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
									{profileMenu.first.map((item) => (
										<SmallProfileMenuItem name={item} />
									))}
								</div>
								<div className="py-1">
									{profileMenu.second.map((item) => (
										<SmallProfileMenuItem name={item} />
									))}
								</div>
								<div className="py-1">
									{profileMenu.third.map((item) => (
										<SmallProfileMenuItem name={item} />
									))}
								</div>
							</Menu.Items>
						</Transition>
					</>
				)}
			</Menu>
		</div>
	);
}
