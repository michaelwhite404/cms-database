import { CollectionModel } from "../../../../src/interfaces/collectionInterfaces";
import DatabaseModel from "../../../../src/interfaces/databaseInterface";
import CollectionSidebarButton from "./CollectionSidebarButton";

interface ProjectMainAreaProps {
	collections: CollectionModel[];
	setActiveCollection: React.Dispatch<React.SetStateAction<{} | DatabaseModel>>;
	activeCollection: DatabaseModel | {};
}

export default function ProjectMainArea({
	collections,
	setActiveCollection,
	activeCollection,
}: ProjectMainAreaProps) {
	return (
		<div className="relative bg-gray-50">
			<div className="">
				<div
					className="w-64 overflow-y-auto border-r-2 bg-white"
					style={{ height: "calc(100vh - 71px" }}
				>
					{collections.map((collection) => (
						<CollectionSidebarButton
							activeCollection={activeCollection}
							setActiveCollection={setActiveCollection}
							collection={collection}
							key={collection._id}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
