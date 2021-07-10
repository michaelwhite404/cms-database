import {
	CollectionField,
	CollectionValidationOption,
} from "../../../../../src/interfaces/collectionInterfaces";
import NumberInput from "../../../components/Form/NumberInput";
import SelectGroup from "../../../components/Form/SelectGroup";
import StandardInput from "../../../components/Form/StandardInput";
import ToggleInput from "../../../components/Form/ToggleInput";

interface ItemFieldInputProps {
	field: CollectionField;
	value: any;
}

export default function ItemFieldInput({ field, value }: ItemFieldInputProps) {
	// const Input = getFieldDataByType(field.type, "Input");
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
			case "Option":
				const options = field.validations!.options! as CollectionValidationOption[];
				console.log(options);
				return (
					<SelectGroup title={field.name} name={field.slug} id={field.slug} value={value}>
						<SelectGroup.Option>Select an option...</SelectGroup.Option>
						{options.map((o) => (
							<SelectGroup.Option value={o._id as string}>{o.name}</SelectGroup.Option>
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
