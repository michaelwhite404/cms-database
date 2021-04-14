import { Document } from "mongoose"

export interface UserModel extends Document {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's email address */
  email: string;
  /** Unique user slug identifier */
  slug: string;
}