import { CollectionFieldType } from "../../../src/interfaces/collectionInterfaces";
import NumberInput from "../components/Form/NumberInput";
import SelectGroup from "../components/Form/SelectGroup";
import StandardInput from "../components/Form/StandardInput";
import ToggleInput from "../components/Form/ToggleInput";
import ButtonIcon from "../components/Icons/ButtonIcon";
import MiniIcon from "../components/Icons/MiniIcon";
import FormProps from "../interfaces/FormProps";
import BasicForm from "../Pages/Project/Forms/BasicForm";
import BoolForm from "../Pages/Project/Forms/BoolForm";
import DateForm from "../Pages/Project/Forms/DateForm";
import NumberForm from "../Pages/Project/Forms/NumberForm";
import OptionForm from "../Pages/Project/Forms/OptionForm";
import PlainTextForm from "../Pages/Project/Forms/PlainTextForm";
import ReferenceForm from "../Pages/Project/Forms/ReferenceForm";
import RichTextForm from "../Pages/Project/Forms/RichTextForm";

interface FieldData {
	name: string;
	type: CollectionFieldType;
	Form: (props: FormProps) => JSX.Element;
	Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
	SmallIcon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
	validations?: any;
	Input?: (props: any) => JSX.Element;
}

export const fieldData: FieldData[] = [
	{
		name: "Plain Text",
		type: "PlainText",
		Form: PlainTextForm,
		Icon: ButtonIcon.PlainText,
		SmallIcon: MiniIcon.PlainText,
		validations: { singleLine: true, minLength: "", maxLength: "" },
		Input: StandardInput,
	},
	{
		name: "Rich Text",
		type: "RichText",
		Form: RichTextForm,
		Icon: ButtonIcon.RichText,
		SmallIcon: MiniIcon.RichText,
		validations: { singleLine: true, minLength: "", maxLength: "" },
	},
	{
		name: "Image",
		type: "ImageRef",
		Form: BasicForm,
		Icon: ButtonIcon.Image,
		SmallIcon: MiniIcon.Image,
		validations: { singleLine: true },
	},
	{
		name: "Video Link",
		type: "Video",
		Form: BasicForm,
		Icon: ButtonIcon.Video,
		SmallIcon: MiniIcon.Video,
		validations: { singleLine: true },
		Input: StandardInput,
	},
	{
		name: "Link",
		type: "Link",
		Form: BasicForm,
		Icon: ButtonIcon.Link,
		SmallIcon: MiniIcon.Link,
		validations: { singleLine: true },
		Input: StandardInput,
	},
	{
		name: "Email",
		type: "Email",
		Form: BasicForm,
		Icon: ButtonIcon.Email,
		SmallIcon: MiniIcon.Email,
		validations: { singleLine: true },
		Input: StandardInput,
	},
	{
		name: "Phone",
		type: "Phone",
		Form: BasicForm,
		Icon: ButtonIcon.Phone,
		SmallIcon: MiniIcon.Phone,
		validations: { singleLine: true },
		Input: StandardInput,
	},
	{
		name: "Number",
		type: "Number",
		Form: NumberForm,
		Icon: ButtonIcon.Number,
		SmallIcon: MiniIcon.Number,
		validations: {
			format: "integer",
			maximum: "",
			minimum: "",
			decimalPlaces: 0,
			allowNegative: false,
		},
		Input: NumberInput,
	},
	{
		name: "Date",
		type: "Date",
		Form: DateForm,
		Icon: ButtonIcon.Date,
		SmallIcon: MiniIcon.Date,
		validations: { format: "date" },
	},
	{
		name: "Switch",
		type: "Bool",
		Form: BoolForm,
		Icon: ButtonIcon.Bool,
		SmallIcon: MiniIcon.Bool,
		Input: ToggleInput,
	},
	{
		name: "Color",
		type: "Color",
		Form: BasicForm,
		Icon: ButtonIcon.Color,
		SmallIcon: MiniIcon.Color,
		validations: { singleLine: true },
	},
	{
		name: "Option",
		type: "Option",
		Form: OptionForm,
		Icon: ButtonIcon.Option,
		SmallIcon: MiniIcon.Option,
		validations: { options: [] },
		Input: SelectGroup,
	},
	{
		name: "File",
		type: "File",
		Form: BasicForm,
		Icon: ButtonIcon.File,
		SmallIcon: MiniIcon.File,
	},
	{
		name: "Reference",
		type: "ItemRef",
		Form: ReferenceForm,
		Icon: ButtonIcon.Reference,
		SmallIcon: MiniIcon.Reference,
		validations: { collectionId: "" },
	},
	{
		name: "Multi Reference",
		type: "ItemRefMulti",
		Form: ReferenceForm,
		Icon: ButtonIcon.MultiReference,
		SmallIcon: MiniIcon.MultiReference,
		validations: { collectionId: "" },
	},
];

export const getFieldDataByType = <T extends keyof FieldData>(
	type: CollectionFieldType,
	property: T
) => {
	const fieldIndex = fieldData.findIndex((f) => f.type === type);
	return fieldData[fieldIndex][property];
};
