import { ChevronRightIcon, DatabaseIcon } from "@heroicons/react/solid";
import pluralize from "pluralize";
import { useEffect, useState } from "react";
import { CollectionModel } from "../../../../src/interfaces/collectionInterfaces";
import { ItemModel } from "../../../../src/interfaces/itemInterfaces";

interface CollectionSidebarButtonProps {
	collection: CollectionModel;
	setActiveCollection: React.Dispatch<React.SetStateAction<CollectionModel | null>>;
	activeCollection: CollectionModel | null;
	items: ItemModel[] | undefined;
}

export default function CollectionSidebarButton({
	collection,
	setActiveCollection,
	activeCollection,
	items,
}: CollectionSidebarButtonProps) {
	// const handleClick = () => {
	// 	setActiveCollection(collection);
	// };
	const [active, setActive] = useState(false);

	useEffect(() => {
		setActive(!!activeCollection && collection._id === activeCollection._id);
	}, [activeCollection, collection._id]);

	return (
		<div
			className={`${
				active ? "bg-blue-50 text-blue-500" : "text-gray-500"
			} group flex border-b-2 p-4 text-sm cursor-pointer items-end font-semibold hover:bg-blue-50 hover:text-blue-500`}
			style={{ userSelect: "none" }}
			onClick={() => setActiveCollection(collection)}
		>
			<DatabaseIcon className="w-4 mr-2" />
			<div className="overflow-ellipsis whitespace-nowrap overflow-hidden">{collection.name}</div>
			<span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
				{items ? pluralize("item", items.length, true) : "No items"}
			</span>
			<ChevronRightIcon
				className={`${active ? "block" : "hidden"} w-4 ml-auto group-hover:block`}
			/>
		</div>
	);
}
