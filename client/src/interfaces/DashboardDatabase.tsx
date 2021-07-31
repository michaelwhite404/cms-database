import { DatabaseRoles } from "../../../src/interfaces/databaseRoleInterface";

export default interface DashboardDatabase {
	_id: string;
	users: DatabaseUser[];
	name: string;
	slug: string;
	totalUsers: number;
	role: DatabaseRoles;
	pinned: boolean;
}

interface DatabaseUser {
	_id: string;
	email: string;
	firstName: string;
	lastName: string;
}
