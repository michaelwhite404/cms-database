import React, { createContext, ReactNode, useState } from "react";
import CollectionData from "../../../src/interfaces/collectionDataInterfaces";
import defaultCollectionData from "../utils/defaultCollectionData";

const dispatch: React.Dispatch<React.SetStateAction<CollectionData>> = () => {};
type CollectionState = [CollectionData, typeof dispatch];

const NewCollectionContext = createContext<CollectionState>([defaultCollectionData, dispatch]);
export const NewCollectionProvider = ({ children }: { children: ReactNode }) => {
	const [newCollectionData, setNewCollectionData] = useState<CollectionData>(defaultCollectionData);
	return (
		<NewCollectionContext.Provider value={[newCollectionData, setNewCollectionData]}>
			{children}
		</NewCollectionContext.Provider>
	);
};

export default NewCollectionContext;
