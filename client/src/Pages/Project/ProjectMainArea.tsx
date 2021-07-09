import { CollectionModel } from "../../../../src/interfaces/collectionInterfaces";
import { ItemModel } from "../../../../src/interfaces/itemInterfaces";
import AddCollectionIcon from "../../components/Icons/AddCollectionIcon";
import { CollectionWithItems } from "../../interfaces/CollectionWithItems";
import FieldDisplay from "../../interfaces/FieldDisplay";
import CollectionSidebarButton from "./CollectionSidebarButton";
import FakeCollectionSidebarButton from "./FakeCollectionSidebarButton";
import AddCollectionBox from "./MainArea/AddCollectionBox";
import CollectionItemsTable from "./MainArea/CollectionItemsTable";
import CollectionTopBar from "./MainArea/CollectionTopBar";
import EditItem from "./MainArea/EditItem";
import NoItemsBox from "./MainArea/NoItemsBox";
import NonActiveCollectionBox from "./MainArea/NonActiveCollectionBox";

interface ProjectMainAreaProps {
	collections: CollectionModel[];
	setActiveCollection: React.Dispatch<React.SetStateAction<CollectionModel | null>>;
	activeCollection: CollectionModel | null;
	activeItem: ItemModel | null;
	setActiveItem: React.Dispatch<React.SetStateAction<ItemModel | null>>;
	loaded: boolean;
	setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
	collectionItems: CollectionWithItems[] | null;
	setCollectionItems: React.Dispatch<React.SetStateAction<CollectionWithItems[] | null>>;
	display: {
		collectionId: string;
		fieldDisplay: FieldDisplay[];
	}[];
	addItemsToCollection: (collectionId: string, items: ItemModel[]) => void;
}

export default function ProjectMainArea({
	collections,
	setActiveCollection,
	activeCollection,
	activeItem,
	setActiveItem,
	loaded,
	setCreateOpen,
	setEditOpen,
	collectionItems,
	setCollectionItems,
	display,
	addItemsToCollection,
}: ProjectMainAreaProps) {
	const items = collectionItems?.find((ci) => ci.collectionId === activeCollection?._id)?.items;
	const fieldDisplay = display.find((c) => c.collectionId === activeCollection?._id)?.fieldDisplay;

	return (
		<div className="relative bg-white" style={{ userSelect: "none" }}>
			<div className="flex">
				<div
					className={`${loaded ? "overflow-y-auto" : "overflow-hidden"} w-64 border-r bg-white`}
					style={{ height: "calc(100vh - 71px", minWidth: "16rem" }}
				>
					<div
						className="flex justify-between items-center w-full text-md font-semibold text-gray-600 bg-gray-100 border-b border-gray-300 p-4"
						style={{ height: "55px" }}
					>
						{loaded && (
							<>
								<span>CMS Collections</span>
								<button
									className={`p-2 ${
										collections.length > 0
											? "bg-gray-200 hover:bg-gray-300 text-gray-600 focus:ring-purple-500"
											: "bg-blue-500 hover:bg-blue-600 text-gray-50 focus:ring-blue-500"
									} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 `}
									onClick={() => setCreateOpen(true)}
								>
									<AddCollectionIcon width={18} height={18} />
								</button>
							</>
						)}
					</div>
					{loaded ? (
						collections.length ? (
							collections.map((collection) => (
								<CollectionSidebarButton
									activeCollection={activeCollection}
									setActiveCollection={setActiveCollection}
									setActiveItem={setActiveItem}
									collection={collection}
									key={collection._id}
									items={collectionItems?.find((ci) => ci.collectionId === collection?._id)?.items}
								/>
							))
						) : (
							<AddCollectionBox />
						)
					) : (
						Array.from({ length: 25 }).map((_, i) => (
							<FakeCollectionSidebarButton key={`fake${i}`} />
						))
					)}
				</div>
				<div
					className={`flex flex-grow ${!activeCollection && "items-center justify-center"}`}
					style={{ height: "calc(100vh - 71px" }}
				>
					{loaded &&
						(!activeCollection ? (
							<NonActiveCollectionBox setCreateOpen={setCreateOpen} />
						) : !activeItem ? (
							<div className="w-full">
								<CollectionTopBar
									activeCollection={activeCollection}
									setActiveCollection={setActiveCollection}
									setEditOpen={setEditOpen}
								/>
								{items && items.length > 0 ? (
									<CollectionItemsTable
										items={items}
										fieldDisplay={fieldDisplay!}
										setActiveItem={setActiveItem}
									/>
								) : (
									<NoItemsBox
										activeCollection={activeCollection}
										addItemsToCollection={addItemsToCollection}
									/>
								)}
							</div>
						) : (
							<EditItem activeItem={activeItem} activeCollection={activeCollection} />
						))}
				</div>
			</div>
		</div>
	);
}
