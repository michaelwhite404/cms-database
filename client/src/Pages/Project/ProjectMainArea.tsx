import { CollectionModel } from "../../../../src/interfaces/collectionInterfaces";
import { CollectionWithItems } from "../../interfaces/CollectionWithItems";
import FieldDisplay from "../../interfaces/FieldDisplay";
import CollectionSidebarButton from "./CollectionSidebarButton";
import FakeCollectionSidebarButton from "./FakeCollectionSidebarButton";
import CollectionItemsTable from "./MainArea/CollectionItemsTable";
import CollectionTopBar from "./MainArea/CollectionTopBar";
import NonActiveCollectionBox from "./MainArea/NonActiveCollectionBox";

interface ProjectMainAreaProps {
	collections: CollectionModel[];
	setActiveCollection: React.Dispatch<React.SetStateAction<CollectionModel | null>>;
	activeCollection: CollectionModel | null;
	loaded: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	collectionItems: CollectionWithItems[] | null;
	setCollectionItems: React.Dispatch<React.SetStateAction<CollectionWithItems[] | null>>;
	display: {
		collectionId: string;
		fieldDisplay: FieldDisplay[];
	}[];
}

export default function ProjectMainArea({
	collections,
	setActiveCollection,
	activeCollection,
	loaded,
	setOpen,
	collectionItems,
	setCollectionItems,
	display,
}: ProjectMainAreaProps) {
	return (
		<div className="relative bg-white" style={{ userSelect: "none" }}>
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
							<NonActiveCollectionBox setOpen={setOpen} />
						) : (
							<div className="w-full">
								<CollectionTopBar
									activeCollection={activeCollection}
									setActiveCollection={setActiveCollection}
								/>
								<CollectionItemsTable
									items={
										collectionItems?.find((ci) => ci.collectionId === activeCollection?._id)?.items
									}
									fieldDisplay={
										display.find((c) => c.collectionId === activeCollection._id)!.fieldDisplay
									}
								/>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
