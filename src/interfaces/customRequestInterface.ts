import { Request } from "express";
import { CollectionModel } from "../interfaces/collectionInterfaces";
import PathParamsDictionary from "../interfaces/pathParamInterface";
import DatabaseRoleModel from "./databaseRoleInterface";
import { UserModel } from "./userInterfaces";

export interface CustomRequest<T> extends Request {
	/**
	 * The body of the request
	 */
	body: Partial<T>;
	/** An object of parameter variables and their values */
	params: PathParamsDictionary;
	user?: UserModel;
	databaseRole?: DatabaseRoleModel;
	/** Collection retrieved from route parameter */
	collection?: CollectionModel;
}

export interface CustomCollectionRequest<T, U extends CollectionModel> extends CustomRequest<T> {
	/** Collection retrieved from route parameter */
	collection: U;
	/** Database retrieved from route parameter */
	database: string;
}
