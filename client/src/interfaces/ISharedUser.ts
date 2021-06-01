export default interface ISharedUser {
	_id: string;
	name: string;
	email: string;
	imageUrl?: string;
	role?: "editor" | "viewer";
}
