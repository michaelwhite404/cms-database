import { Document, ObjectId } from "mongoose";
type DatabaseRoles = "owner" | "editor" | "viewer";

export default interface DatabaseRoleModel extends Document {
	/** Auto-generated ObjectId */
	_id: ObjectId | string;
	/** The user who has access to the database */
	user: string | ObjectId;
	/** The database the user has access to */
	database: string | ObjectId;
	/** The role the user has for this database */
	role: DatabaseRoles;
}
