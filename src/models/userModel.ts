import { Document, Schema, Model, model } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import validator from "validator";

import { UserModel, UserModelDocument } from "../interfaces/userInterfaces";

/** User Schema */
const userSchema: Schema<UserModelDocument, Model<Document<UserModel>>> = new Schema(
	{
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
			validate: [validator.isEmail, " Please provide a valid email"],
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
			minlength: 8,
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, "Please confirm your password"],
			validate: {
				// This only works on CREATE or SAVE
				validator: function (val: string): boolean {
					// @ts-ignore
					return val === this.password;
				},
				message: "Passwords are not the same!",
			},
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		lastLogin: Date,
		createdAt: {
			type: Date,
			default: () => Date.now(),
			required: true,
			immutable: true,
		},
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

userSchema.virtual("fullName").get(function (this: UserModel) {
	return `${this.firstName} ${this.lastName}`;
});

// userSchema.pre<UserModel>("save", function (next) {
// 	this.slug = slugify(`${this.firstName} ${this.lastName}`, { lower: true });
// 	next();
// });

userSchema.pre<UserModel>("save", async function (next) {
	// Only run if password is modified
	if (!this.isModified("password")) return next();
	// Hash the password with cost of 12
	this.password = await bcrypt.hash(this.password, 12);
	// Delete passwordConfirm field
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function (candidatePassword: any, userPassword: string) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre<UserModel>("save", function (next) {
	if (!this.isModified("password") || this.isNew) return next();

	this.passwordChangedAt = new Date(Date.now() - 1000);
	next();
});

userSchema.pre<Model<Document<UserModel>>>(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	// @ts-ignore
	next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
	if (this.passwordChangedAt) {
		const changedTimeStamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);

		// console.log(changedTimeStamp, JWTTimestamp);
		return JWTTimestamp < changedTimeStamp;
	}

	// FALSE means NOT changed
	return false;
};

userSchema.methods.createPasswordResetToken = function (): string {
	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
	console.log({ resetToken }, this.passwordResetToken);
	this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
	return resetToken;
};

/** Model for User Schema */
const User: Model<UserModel> = model<UserModel>("User", userSchema);

export default User;
