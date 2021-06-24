import { CogIcon, XIcon } from "@heroicons/react/solid";
import { CollectionModel } from "../../../../../src/interfaces/collectionInterfaces";

interface CollectionTopBarProps {
	activeCollection: CollectionModel;
	setActiveCollection: React.Dispatch<React.SetStateAction<CollectionModel | null>>;
}

export default function CollectionTopBar({
	activeCollection,
	setActiveCollection,
}: CollectionTopBarProps) {
	return (
		<div className="flex justify-between w-full items-center px-4 py-2 bg-gray-100 border-b border-gray-300">
			<div className="flex items-center">
				<h3 className="text-gray-600 font-semibold text-md">{activeCollection.name}</h3>
				<button className="ml-3 p-1 text-gray-500 rounded-md focus:outline-none hover:bg-gray-200">
					<XIcon width={16} onClick={() => setActiveCollection(null)} />
				</button>
			</div>
			<div className="flex items-center">
				<button className="order-1 mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-0 sm:ml-0">
					<CogIcon className="mr-2" width={16} />
					Settings
				</button>
				<button className="order-0 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-normal rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:order-2">
					{`+ New ${activeCollection.singularName}`}
				</button>
			</div>
		</div>
	);
}
