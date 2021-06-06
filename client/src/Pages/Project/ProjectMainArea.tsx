import { DatabaseIcon } from "@heroicons/react/solid";
import { CollectionModel } from "../../../../src/interfaces/collectionInterfaces";

interface ProjectMainAreaProps {
	collections: CollectionModel[];
}

export default function ProjectMainArea({ collections }: ProjectMainAreaProps) {
	return (
		<div className="relative">
			<div className="absolute inset-0">
				<div className="w-64 overflow-y-auto border-r-2" style={{ height: "calc(100vh - 71px" }}>
					{collections.map((collection) => (
						<div
							key={collection._id}
							className="flex border-b-2 p-4 text-sm cursor-pointer items-end text-gray-500 font-semibold hover:bg-gray-50"
							style={{ userSelect: "none" }}
						>
							<DatabaseIcon className="w-4 mr-2" />
							<div>{collection.name}</div>
							<span className="text-xs text-gray-300 ml-2">3 items</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
