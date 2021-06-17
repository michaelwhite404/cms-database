import { ExclamationIcon } from "@heroicons/react/solid";

export default function ErrorTooltip({ children }: { children: string }) {
	return (
		<div className="absolute right-0 -top-8 ">
			<div className="relative flex text-xs bg-red-500 items-center text-white py-1 px-3 rounded-md z-20">
				<ExclamationIcon className="mt-1 mr-1" color="white" width={10} />
				<span>{children}</span>
			</div>
			<div
				className="absolute bg-red-500 -mt-1.5 h-3 right-5 w-3 z-10"
				style={{ transform: "rotate(45deg)" }}
			></div>
		</div>
	);
}
