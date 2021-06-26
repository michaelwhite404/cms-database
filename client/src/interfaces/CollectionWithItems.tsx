import { ItemModel } from "../../../src/interfaces/itemInterfaces";

export interface CollectionWithItems {
	collectionId: string;
	items: ItemModel[];
}
