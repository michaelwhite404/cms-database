import { Document, ObjectId } from "mongoose";

export interface UserModel extends Document {
	/** Auto-generated user ObjectId _id  */
	_id: ObjectId | string;
	/** User's first name */
	firstName: string;
	/** User's last name */
	lastName: string;
	/** The user's first and last name (Virtual Property) */
	fullName: string;
	/** User's email address */
	email: string;
	/** Unique user slug identifier */
	slug: string;
	/** The user's password */
	password: string;
	/** The user's confirmed password */
	passwordConfirm?: string;
	/** The date the user changed their password */
	passwordChangedAt?: Date;
	/** The user's reset token */
	passwordResetToken?: string;
	/** The date and time a password reset token will expire */
	passwordResetExpires?: Date;
	/** The date of the user's last login */
	lastLogin?: Date;
	/** The date the user was created (immutable) */
	createdAt: Date;
	/** Field indicating whether or not the user is an active user */
	active: boolean;
	correctPassword(inputPassword: any, password: string): boolean;
	changedPasswordAfter(JWTTimestamp: number): boolean;
	/** Returns a new password reset token */
	createPasswordResetToken(): string;
}

export interface UserModelDocument extends Document<UserModel> {
	/** The date the user changed their password */
	passwordChangedAt?: Date;
	/** The user's reset token */
	passwordResetToken?: string;
	/** The date and time a password reset token will expire */
	passwordResetExpires?: Date;
}
