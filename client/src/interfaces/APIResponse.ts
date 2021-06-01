import { CollectionModel } from "../../../src/interfaces/collectionInterfaces";
import DatabaseModel from "../../../src/interfaces/databaseInterface";
import { ItemModel } from "../../../src/interfaces/itemInterfaces";
import DashboardDatabase from "./DashboardDatabase";
import ISharedUser from "./ISharedUser";

interface APIResponse {
	/** The status of the response */
	status: "success";
	/** The number of results returned */
	results?: number;
	/** The maximum number of documents that will be returned  */
	limit?: number;
	/** The page number of the response */
	page?: number;
}

export interface APICollectionResponse extends APIResponse {
	/** The database the collection(s) exists in */
	database: CollectionModel["database"];
	/** All of the returned collections that match the query */
	collections: CollectionModel[];
	/** The returned collection */
	collection: CollectionModel;
}

export interface APIDatabaseRepsonse extends APIResponse {
	database: DatabaseModel;
	databases: DatabaseModel[];
}

export interface APIItemResponse extends APIResponse {
	item: ItemModel;
	items: ItemModel[];
}

export interface APIDashboardResponse {
	status: "success";
	databases: DashboardDatabase[];
}

export interface APIUserByEmailRes {
	status: "success";
	user: ISharedUser;
}
