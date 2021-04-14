import { Document, ObjectId } from "mongoose"

export default interface DatabaseModel extends Document {
  /** The database _id */
  _id: string;
  /** The name of the database */
  name: string;
  /** The user that created the database */
  createdBy: string | ObjectId;
  /** The date the database was created */
  createdAt: string;
}