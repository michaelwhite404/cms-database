import { model, Model, Schema, Types } from "mongoose";

import DatabaseModel from "../interfaces/databaseInterface";

const databaseSchema = new Schema({
  name: {
    type: String,
    required: [true, "Each database must have a name"]
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    // required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now()
  }
});

const Database: Model<DatabaseModel> = model<DatabaseModel>("Database", databaseSchema);

export default Database;