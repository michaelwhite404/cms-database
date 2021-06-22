import React from "react";
import { CollectionModel } from "../../../../src/interfaces/collectionInterfaces";
import CollectionSidebarButton from "./CollectionSidebarButton";
import FakeCollectionSidebarButton from "./FakeCollectionSidebarButton";
import { CollectionWithItems } from "./Project";

interface ProjectMainAreaProps {
	collections: CollectionModel[];
	setActiveCollection: React.Dispatch<React.SetStateAction<CollectionModel | null>>;
	activeCollection: CollectionModel | null;
	loaded: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	collectionItems: CollectionWithItems[] | null;
	setCollectionItems: React.Dispatch<React.SetStateAction<CollectionWithItems[] | null>>;
}

export default function ProjectMainArea({
	collections,
	setActiveCollection,
	activeCollection,
	loaded,
	setOpen,
	collectionItems,
	setCollectionItems,
}: ProjectMainAreaProps) {
	return (
		<div className="relative bg-gray-50">
			<div className="flex">
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
				<div className="flex flex-grow overflow-auto" style={{ height: "calc(100vh - 71px" }}>
					{loaded &&
						(!activeCollection ? (
							<div className="flex flex-col align-center border-4 border-dotted rounded-lg px-24 py-12">
								<span className="flex justify-center">
									Select a collection <span className="font-bold ml-1">OR</span>
								</span>
								<button
									type="button"
									className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-1 sm:mt-3"
									onClick={() => setOpen(true)}
								>
									+ Create New Collection
								</button>
							</div>
						) : (
							<div>
								{collectionItems
									?.find((ci) => ci.collectionId === activeCollection?._id)
									?.items.map((i) => (
										<div className="border-2">
											{Object.entries(i).map(([k, v]) => (
												<div>{`${k}:${v}`}</div>
											))}
										</div>
									))}
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
