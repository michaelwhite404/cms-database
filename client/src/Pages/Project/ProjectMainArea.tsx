import { CollectionModel } from "../../../../src/interfaces/collectionInterfaces";
import { CollectionWithItems } from "../../interfaces/CollectionWithItems";
import FieldDisplay from "../../interfaces/FieldDisplay";
import CollectionSidebarButton from "./CollectionSidebarButton";
import FakeCollectionSidebarButton from "./FakeCollectionSidebarButton";
import CollectionItemsTable from "./MainArea/CollectionItemsTable";
import CollectionTopBar from "./MainArea/CollectionTopBar";
import NoItemsBox from "./MainArea/NoItemsBox";
import NonActiveCollectionBox from "./MainArea/NonActiveCollectionBox";

interface ProjectMainAreaProps {
	collections: CollectionModel[];
	setActiveCollection: React.Dispatch<React.SetStateAction<CollectionModel | null>>;
	activeCollection: CollectionModel | null;
	loaded: boolean;
	setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
	setCreateOpen,
	setEditOpen,
	collectionItems,
	setCollectionItems,
	display,
}: ProjectMainAreaProps) {
	const items = collectionItems?.find((ci) => ci.collectionId === activeCollection?._id)?.items;
	const fieldDisplay = display.find((c) => c.collectionId === activeCollection?._id)?.fieldDisplay;

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
							<NonActiveCollectionBox setCreateOpen={setCreateOpen} />
						) : (
							<div className="w-full">
								<CollectionTopBar
									activeCollection={activeCollection}
									setActiveCollection={setActiveCollection}
									setEditOpen={setEditOpen}
								/>
								{items && items.length > 0 ? (
									<CollectionItemsTable items={items} fieldDisplay={fieldDisplay!} />
								) : (
									<NoItemsBox activeCollection={activeCollection} />
								)}
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
