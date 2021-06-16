import { CollectionDataFields } from "../../../src/interfaces/collectionDataInterfaces";

export default interface FormProps {
	activeField: CollectionDataFields | null;
	setActiveField: React.Dispatch<React.SetStateAction<CollectionDataFields | null>>;
	submitNewField: () => void;
	changeValidationField?: (name: string, value: any) => void;
}
