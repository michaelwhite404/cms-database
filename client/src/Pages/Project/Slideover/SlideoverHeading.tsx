import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";

interface SlideoverHeadingProps {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SlideoverHeading({ setOpen }: SlideoverHeadingProps) {
	return (
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
	);
}
