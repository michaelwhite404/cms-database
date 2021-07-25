import {
	CollectionField,
	CollectionModel,
	CollectionValidationOption,
} from "../../../../../src/interfaces/collectionInterfaces";
import { ItemModel } from "../../../../../src/interfaces/itemInterfaces";
import ColorInput from "../../../components/Form/ColorInput";
import FileInput from "../../../components/Form/FileInput";
import NumberInput from "../../../components/Form/NumberInput";
import SelectGroup from "../../../components/Form/SelectGroup";
import SelectMultiInput from "../../../components/Form/SelectMultiInput";
import StandardInput from "../../../components/Form/StandardInput";
import ToggleInput from "../../../components/Form/ToggleInput";

interface ItemFieldInputProps {
	field: CollectionField;
	value: any;
	getItemsByCollectionId?: (collectionId?: string) => ItemModel[] | undefined;
	getCollectionById: (collectionId?: string) => CollectionModel | undefined;
}

export default function ItemFieldInput({
	field,
	value,
	getItemsByCollectionId,
	getCollectionById,
}: ItemFieldInputProps) {
	const collection = getCollectionById?.(field.validations?.collectionId);
	const items = getItemsByCollectionId?.(field.validations?.collectionId);
	const mainFieldName = collection?.fields[0].slug;
	const Input = (): JSX.Element => {
		switch (field.type) {
			case "Bool":
				return (
					<ToggleInput
						name={field.slug}
						id={field.slug}
						title={field.name}
						checked={value || false}
					/>
				);
			case "Number":
				return (
					<div className="w-72">
						<NumberInput
							title={field.name}
							name={field.slug}
							id={field.slug}
							value={value}
							handleChange={() => {}}
							required={field.required}
							arrows
							increment={() => {}}
							decrement={() => {}}
						/>
					</div>
				);
			case "ItemRef":
				return (
					<SelectGroup title={field.name} name={field.slug} id={field.slug} value={value}>
						<SelectGroup.Option>Select an option...</SelectGroup.Option>
						{items &&
							items.map((item) => (
								<SelectGroup.Option value={item._id as string}>
									{item[mainFieldName!]}
								</SelectGroup.Option>
							))}
					</SelectGroup>
				);
			case "ItemRefMulti":
				const itemOptions =
					items?.map((i) => ({ label: i[mainFieldName!], value: i._id as string })) || [];
				const defaultValue =
					items
						?.filter((i) => value.includes(i._id))
						.map((i) => ({ label: i[mainFieldName!], value: i._id as string })) || [];
				return (
					<SelectMultiInput
						title={field.name}
						name={field.slug}
						id={field.slug}
						options={itemOptions}
						defaultValue={defaultValue}
						required={field.required}
					/>
				);
			case "Color":
				return (
					<ColorInput
						title={field.name}
						name={field.slug}
						id={field.slug}
						value={value}
						handleChange={() => {}}
						required={field.required}
					/>
				);
			case "Option":
				const options = field.validations!.options! as CollectionValidationOption[];
				return (
					<SelectGroup title={field.name} name={field.slug} id={field.slug} value={value}>
						<SelectGroup.Option>Select an option...</SelectGroup.Option>
						{options.map((o) => (
							<SelectGroup.Option key={o._id as string} value={o._id as string}>
								{o.name}
							</SelectGroup.Option>
						))}
					</SelectGroup>
				);
			case "File":
			case "ImageRef":
				return (
					<FileInput
						name={field.slug}
						id={field.slug}
						title={field.name}
						required={field.required}
						image={field.type === "ImageRef"}
					/>
				);
			default:
				return (
					<StandardInput
						name={field.slug}
						id={field.slug}
						title={field.name}
						required={field.required}
						handleChange={() => {}}
						value={value}
					/>
				);
		}
	};

	return (
		<div className="mb-3">
			<Input />
		</div>
	);
}
