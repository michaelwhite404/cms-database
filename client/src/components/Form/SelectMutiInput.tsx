import Select from "react-select";
import { ItemModel } from "../../../../src/interfaces/itemInterfaces";

export default function SelectMutliInput({
	items,
	defaultValue,
	fieldSlug,
}: {
	items: ItemModel[];
	defaultValue: ItemModel[];
	fieldSlug?: string;
}) {
	console.log(fieldSlug);
	const options = items.map((i) => ({ label: i[fieldSlug!], value: i._id as string }));
	const value = defaultValue.map((i) => ({ label: i[fieldSlug!], value: i._id as string }));

	return <Select closeMenuOnSelect={false} defaultValue={value} isMulti options={options} />;
}
