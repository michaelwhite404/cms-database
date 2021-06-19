import { createContext, ReactNode, useState } from "react";
import { CollectionModel } from "../../../src/interfaces/collectionInterfaces";

const dispatch: React.Dispatch<React.SetStateAction<CollectionModel[]>> = () => {};
type ProjectCollectionsState = [CollectionModel[], typeof dispatch];

const ProjectCollectionsContext = createContext<ProjectCollectionsState>([[], dispatch]);
export const ProjectCollectionsProvider = ({ children }: { children: ReactNode }) => {
	const [collections, setCollections] = useState<CollectionModel[]>([]);
	return (
		<ProjectCollectionsContext.Provider value={[collections, setCollections]}>
			{children}
		</ProjectCollectionsContext.Provider>
	);
};

export default ProjectCollectionsContext;
