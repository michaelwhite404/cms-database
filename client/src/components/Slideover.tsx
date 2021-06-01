import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface SlideoverProps {
	children: JSX.Element;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Slideover({ children, open, setOpen }: SlideoverProps) {
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				static
				className="fixed inset-0 overflow-hidden"
				open={open}
				onClose={setOpen}
			>
				<div className="absolute inset-0 overflow-hidden">
					<Transition.Child
						as={Fragment}
						enter="ease-in-out duration-500"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in-out duration-500"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>
					<div className="fixed lg:inset-y-0 top-16 bottom-0 pl-16 max-w-full right-0 flex">
						<Transition.Child
							as={Fragment}
							enter="transform transition ease-in-out duration-500 sm:duration-700"
							enterFrom="translate-x-full"
							enterTo="translate-x-0"
							leave="transform transition ease-in-out duration-500 sm:duration-700"
							leaveFrom="translate-x-0"
							leaveTo="translate-x-full"
						>
							<div className="w-screen max-w-md">{children}</div>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
