import { Schema, Model, model } from "mongoose";
import slugify from "slugify";

import { UserModel } from "../interfaces/userInterfaces";

/** User Schema */
const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "A user must have a first name"],
  },
  lastName: {
    type: String,
    required: [true, "A user must have a last name"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email address"],
    unique: true,
    // validate: {
    //   validator
    // }
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: false /* [true, "Please confirm your password"], */,
    // validate: {
    //   // This only works on CREATE or SAVE
    //   validator: function (val: string): boolean {
    //     return val === this.password;
    //   },
    //   message: "Passwords are not the same!",
    // },
  },
  slug: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
    required: true,
    immutable: true,
  },
});

userSchema.virtual("fullName").get(function (this: UserModel) {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre<UserModel>("save", function (next) {
  this.slug = slugify(`${this.firstName} ${this.lastName}`, { lower: true });
  next();
});

/** Model for User Schema */
const User: Model<UserModel> = model<UserModel>("User", userSchema);

export default User;
