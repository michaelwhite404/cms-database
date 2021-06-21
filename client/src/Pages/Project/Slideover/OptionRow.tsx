import { TrashIcon } from "@heroicons/react/solid";
import React, { ChangeEvent, KeyboardEvent, MouseEvent, useState } from "react";
import { useRef } from "react";
import { TiPencil } from "react-icons/ti";
import { CollectionValidationOption } from "../../../../../src/interfaces/collectionInterfaces";

interface OptionsRowProps {
	name: string;
	id: string;
	options: CollectionValidationOption[];
	changeOptions: (optionsArray: CollectionValidationOption[]) => void;
}

export default function OptionRow({ name, id, options, changeOptions }: OptionsRowProps) {
	const [isEditing, setIsEditing] = useState(true);
	const ref = useRef<HTMLInputElement>(null);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const copiedOptions = options.slice();
		const index = copiedOptions.findIndex((o) => o._id === id);
		copiedOptions[index] = { _id: id, name: e.target.value };
		changeOptions(copiedOptions);
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		console.log(e.key);
		e.key === "Enter" && ref!.current!.blur();
	};

	const handleDelete = (e: MouseEvent<HTMLDivElement>) => {
		if (e.stopPropagation) e.stopPropagation();
		const copiedOptions = options.slice();
		changeOptions(copiedOptions.filter((o) => o._id !== id));
	};

	return (
		<div
			className={`${
				isEditing && "bg-gray-100"
			} flex group relative pl-4 items-center w-full h-8 border-b border-gray-300 text-xs`}
			onClick={(e) => {
				setIsEditing(true);
			}}
		>
			{isEditing ? (
				<>
					<input
						className="w-full h-full bg-transparent outline-none text-xs z-20"
						value={name}
						onBlur={() => setIsEditing(false)}
						onChange={handleChange}
						onKeyPress={handleKeyPress}
						ref={ref}
						autoFocus
					/>
					<span className="absolute right-3 text-gray-500 z-10">Press Enter To Save</span>
				</>
			) : (
				<>
					<span className="mr-2">{name}</span>
					<span className="hidden group-hover:inline">
						<TiPencil />
					</span>
					<div
						className="hidden group-hover:inline absolute p-1 right-3 text-gray-500 rounded-md hover:bg-gray-100"
						onClick={handleDelete}
					>
						<span className="sr-only">Delete</span>
						<TrashIcon width={14} />
					</div>
				</>
			)}
		</div>
	);
}
