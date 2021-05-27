import { Menu } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/solid";
import classNames from "../utils/classNames";

export default function MenuItem({
	name,
	Icon,
}: {
	name: string;
	Icon?: (props: React.ComponentProps<"svg">) => JSX.Element;
}) {
	return (
		<Menu.Item>
			{({ active }) => (
				<button
					className={classNames(
						active ? "bg-gray-100 text-gray-900" : "text-gray-700",
						"group flex items-center px-4 py-2 text-sm w-full"
					)}
				>
					{Icon && (
						<Icon
							className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
							aria-hidden="true"
						/>
					)}
					{name}
				</button>
			)}
		</Menu.Item>
	);
}
