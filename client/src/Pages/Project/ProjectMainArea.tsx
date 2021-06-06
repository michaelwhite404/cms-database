import React from "react";
import { CollectionModel } from "../../../../src/interfaces/collectionInterfaces";
import DatabaseModel from "../../../../src/interfaces/databaseInterface";
import CollectionSidebarButton from "./CollectionSidebarButton";
import FakeCollectionSidebarButton from "./FakeCollectionSidebarButton";

interface ProjectMainAreaProps {
	collections: CollectionModel[];
	setActiveCollection: React.Dispatch<React.SetStateAction<{} | DatabaseModel>>;
	activeCollection: DatabaseModel | {};
	loaded: boolean;
}

export default function ProjectMainArea({
	collections,
	setActiveCollection,
	activeCollection,
	loaded,
}: ProjectMainAreaProps) {
	return (
		<div className="relative bg-gray-50">
			<div className="">
				<div
					className={`${loaded ? "overflow-y-auto" : "overflow-hidden"} w-64 border-r bg-white`}
					style={{ height: "calc(100vh - 71px" }}
				>
					{loaded
						? collections.map((collection) => (
								<CollectionSidebarButton
									activeCollection={activeCollection}
									setActiveCollection={setActiveCollection}
									collection={collection}
									key={collection._id}
								/>
						  ))
						: Array.from({ length: 25 }).map((_, i) => (
								<FakeCollectionSidebarButton key={`fake${i}`} />
						  ))}
				</div>
			</div>
		</div>
	);
}
