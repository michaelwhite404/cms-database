import {
	CollectionField,
	CollectionModel,
	CollectionValidationOption,
} from "../../../../../src/interfaces/collectionInterfaces";
import { ItemModel } from "../../../../../src/interfaces/itemInterfaces";
import ColorInput from "../../../components/Form/ColorInput";
import NumberInput from "../../../components/Form/NumberInput";
import SelectGroup from "../../../components/Form/SelectGroup";
import SelectMutliInput from "../../../components/Form/SelectMutiInput";
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
	// const Input = getFieldDataByType(field.type, "Input");
	const fieldSlug = getCollectionById?.(field.validations?.collectionId)?.fields[0].slug;
	const items = getItemsByCollectionId?.(field.validations?.collectionId);
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
								/**BUG TODO: Change item.name */
								<SelectGroup.Option value={item._id as string}>{item.name}</SelectGroup.Option>
							))}
					</SelectGroup>
				);
			case "ItemRefMulti":
				return (
					<SelectMutliInput
						fieldSlug={fieldSlug}
						items={items || []}
						defaultValue={items?.filter((i) => value.includes(i._id)) || []}
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
