import { CollectionFieldType } from "../../../src/interfaces/collectionInterfaces";
import ButtonIcon from "../components/Icons/ButtonIcon";
import ImageIcon from "../components/Icons/FieldMiniIcons/ImageIcon";
import PlainTextIcon from "../components/Icons/FieldMiniIcons/PlainTextIcon";
import FormProps from "../interfaces/FormProps";
import BasicForm from "../Pages/Project/Forms/BasicForm";
import PlainTextForm from "../Pages/Project/Forms/PlainTextForm";

interface FieldData {
	name: string;
	type: CollectionFieldType;
	form: (props: FormProps) => JSX.Element;
	Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
	SmallIcon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
	validations?: any;
}

const fieldData: FieldData[] = [
	{
		name: "Plain Text",
		type: "PlainText",
		form: PlainTextForm,
		Icon: ButtonIcon.PlainText,
		SmallIcon: PlainTextIcon,
		validations: { singleLine: true, minLength: "", maxLength: "" },
	},
	// {
	// 	name: "Rich Text",
	// 	type: "RichText",
	// 	Icon: ButtonIcon.RichText,
	// 	validations: { singleLine: true, minLength: "", maxLength: "" },
	// },
	{
		name: "Image",
		type: "ImageRef",
		form: BasicForm,
		Icon: ButtonIcon.Image,
		SmallIcon: ImageIcon,
		validations: { singleLine: true },
	},
];

export const getFieldDataByType = <T extends keyof FieldData>(
	type: CollectionFieldType,
	property: T
) => {
	const fieldIndex = fieldData.findIndex((f) => f.type === type);
	return fieldData[fieldIndex][property];
};
