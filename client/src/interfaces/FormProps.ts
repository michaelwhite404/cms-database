import { CollectionDataFields } from "../../../src/interfaces/collectionDataInterfaces";
import { CollectionValidationsKeys } from "../../../src/interfaces/collectionInterfaces";

export default interface FormProps {
	activeField: CollectionDataFields | null;
	setActiveField: React.Dispatch<React.SetStateAction<CollectionDataFields | null>>;
	submitNewField: () => void;
	changeValidationField?: (name: CollectionValidationsKeys, value: any) => void;
}
