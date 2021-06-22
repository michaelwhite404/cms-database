import { XIcon } from "@heroicons/react/solid";
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
									items={collectionItems?.find((ci) => ci.collectionId === collection?._id)?.items}
								/>
						  ))
						: Array.from({ length: 25 }).map((_, i) => (
								<FakeCollectionSidebarButton key={`fake${i}`} />
						  ))}
				</div>
				<div
					className={`flex flex-grow ${!activeCollection && "items-center justify-center"}`}
					style={{ height: "calc(100vh - 71px" }}
				>
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
							<div className="w-full">
								<div className="flex justify-between w-full items-center px-4 py-2 bg-gray-100 border-b border-gray-300">
									<div className="flex items-center">
										<h3 className="text-gray-600 font-semibold">{activeCollection.name}</h3>
										<button className="ml-3 p-1 text-gray-500 rounded-md focus:outline-none hover:bg-gray-200">
											<XIcon width={16} onClick={() => setActiveCollection(null)} />
										</button>
									</div>
									<div className="flex items-center">
										<button className="order-0 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-normal rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:order-2">
											{`+ New ${activeCollection.singularName}`}
										</button>
									</div>
								</div>
								<div className="overflow-auto" style={{ height: "calc(100% - 40px)" }}>
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
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
