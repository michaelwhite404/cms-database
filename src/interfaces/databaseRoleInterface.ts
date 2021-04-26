import { Document, ObjectId } from "mongoose";
import DatabaseModel from "./databaseInterface";
import { UserModel } from "./userInterfaces";
export type DatabaseRoles = "owner" | "editor" | "viewer";

export default interface DatabaseRoleModel extends Document {
	/** Auto-generated ObjectId */
	_id: ObjectId | string;
	/** The user who has access to the database */
	user: string | ObjectId | UserModel;
	/** The database the user has access to */
	database: string | ObjectId | DatabaseModel;
	/** The role the user has for this database */
	role: DatabaseRoles;
}
