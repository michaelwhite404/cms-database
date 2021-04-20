import { Document, ObjectId } from "mongoose";

export default interface DatabaseModel extends Document {
	/** The database _id */
	_id: string;
	/** The name of the database */
	name: string;
	/** The user that created the database */
	createdBy: string | ObjectId;
	/** Unique slug identifier for the database */
	slug: string;
	/** The timezone of the client of the database creator */
	timezone: string;
	/** The date the database was created */
	createdAt: string;
}
