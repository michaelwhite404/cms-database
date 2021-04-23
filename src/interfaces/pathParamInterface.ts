import { ParamsDictionary } from "express-serve-static-core";

export default interface PathParamsDictionary extends ParamsDictionary {
	/** The path parameter value for the item id */
	item_id: string;
	/** The path parameter value for the collection id */
	collection_id: string;
	/** The path parameter value for the database id */
	database_id: string;
	/** The path parameter value for the field id */
	field_id: string;
	/** The path parameter value for the user id */
	user_id: string;
}
