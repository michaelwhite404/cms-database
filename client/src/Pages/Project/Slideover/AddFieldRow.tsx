import { ArrowCircleDownIcon, PlusIcon, XIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";

export default function AddFieldRow() {
	const [active, setActive] = useState(false);
	const [fieldSelected, setFieldSelected] = useState(false);
	const myRef = useRef<HTMLDivElement>();

	const handleClick = () => {
		if (!active) {
			setActive(true);
		}
	};

	useEffect(() => {
		active && myRef.current!.scrollIntoView({ behavior: "smooth" });
	}, [active]);

	return (
		<div
			className={`py-2.5 px-4 text-xs text-gray-700 relative font-semibold ${
				!active && "hover:bg-gray-50"
			}`}
			style={{ userSelect: "none" }}
			// @ts-ignore
			ref={myRef}
			onClick={handleClick}
		>
			<div className="flex items-center">
				{!active && (
					<span className="flex items-center text-purple-600">
						<PlusIcon className="mr-3" width={16} />
						<span className="mr-3">Add Field</span>
					</span>
				)}
				{active && !fieldSelected && (
					<>
						<ArrowCircleDownIcon className="mr-3" width={16} />
						<span className="mr-3">Select Field Type</span>
						<button
							className="flex text-gray-400 ml-auto focus:outline-none"
							onClick={() => setActive(false)}
						>
							<XIcon className="mr-1.5" width={16} />
							Cancel
						</button>
					</>
				)}
			</div>
			{active && <div className="mt-4 h-20 bg-black" />}
		</div>
	);
}
