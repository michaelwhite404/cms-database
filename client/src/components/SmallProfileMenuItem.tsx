import { Menu } from "@headlessui/react";
import classNames from "../utils/classNames";

export default function SmallProfileMenuItem({ name }: { name: string }) {
	return (
		<Menu.Item>
			{({ active }) => (
				<button
					className={classNames(
						active ? "bg-gray-100 text-gray-900" : "text-gray-700",
						"flex px-4 py-2 text-sm w-full"
					)}
				>
					{name}
				</button>
			)}
		</Menu.Item>
	);
}
