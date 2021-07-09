import { CollectionModel } from "../../../../../src/interfaces/collectionInterfaces";
import { ItemModel } from "../../../../../src/interfaces/itemInterfaces";
import StandardInput from "../../../components/Form/StandardInput";
import Pane from "../../../components/Pane";

interface Props {
	activeItem: ItemModel;
	activeCollection: CollectionModel;
}

export default function EditItem({ activeItem, activeCollection }: Props) {
	const fields = [...activeCollection.fields];
	const basicInfoFields = fields.slice(0, 2);
	const customFields = fields.slice(2, fields.length - 4);
	return (
		<div
			className="flex flex-col divide-y divide-gray-200 py-4 w-full"
			style={{ overflowY: "auto" }}
		>
			<Pane>
				<Pane.MiniTitle>Basic Info</Pane.MiniTitle>
				{basicInfoFields.map((field) => (
					<StandardInput
						title={field.name}
						name={field.slug}
						required={field.required}
						handleChange={() => {}}
						value={activeItem[field.slug]}
					/>
				))}
			</Pane>
			<Pane>
				<Pane.MiniTitle>Custom Fields</Pane.MiniTitle>
				{customFields.map((field) => (
					<StandardInput
						title={field.name}
						name={field.slug}
						helpText={field.helpText}
						required={field.required}
						handleChange={() => {}}
						value={activeItem[field.slug]}
					/>
				))}
			</Pane>
		</div>
	);
}
