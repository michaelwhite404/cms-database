export default interface FormErrors {
	name: string;
	minLength?: string;
	maxLength?: string;
	minimum?: string;
	maximum?: string;
	format?: string;
	collection?: string;
	options?: string;
}
