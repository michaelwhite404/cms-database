import { useContext, ReactNode } from "react";
import moment from "moment";
import { CollectionModel } from "../../../../../src/interfaces/collectionInterfaces";
import { ItemModel } from "../../../../../src/interfaces/itemInterfaces";
import StandardInput from "../../../components/Form/StandardInput";
import Pane from "../../../components/Pane";
import ProjectsContext from "../../../context/ProjectsContext";
import ItemFieldInput from "./ItemFieldInput";

interface Props {
	activeItem: ItemModel;
	activeCollection: CollectionModel;
	getItemsByCollectionId: (collectionId?: string) => ItemModel[] | undefined;
	getCollectionById: (collectionId?: string) => CollectionModel | undefined;
}

export default function EditItem({
	activeItem,
	activeCollection,
	getItemsByCollectionId,
	getCollectionById,
}: Props) {
	const { users } = useContext(ProjectsContext).projects.find(
		(p) => p._id === activeItem.database
	)!;
	const getUser = (user_id: string) => users.find((user) => user._id === user_id);

	const formatUserText = (key: "created" | "updated") => {
		const { firstName, lastName } = getUser(activeItem[`${key}-by`])!;
		const name = firstName + " " + lastName;
		const date = moment(activeItem[`${key}-on`]).format("MMM D, YYYY, h:MM A");
		const fullText = `${date} by ${name}`;
		return (
			<div className="flex">
				<img
					src={`https://ui-avatars.com/api/?background=ffb300&name=${name[0]}&length=1&color=ffffff`}
					alt="Profile"
					height={22}
					width={22}
					className="rounded-2xl mr-2"
				/>
				<span>{fullText}</span>
			</div>
		);
	};

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
						key={field._id as string}
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
					<ItemFieldInput
						key={field._id as string}
						field={field}
						value={activeItem[field.slug]}
						getItemsByCollectionId={getItemsByCollectionId}
						getCollectionById={getCollectionById}
					/>
				))}
			</Pane>
			<Pane>
				<div className="pt-5">
					<ItemInfo label="Item ID">{activeItem._id as string}</ItemInfo>
					<ItemInfo label="Created">{formatUserText("created")}</ItemInfo>
					<ItemInfo label="Updated">{formatUserText("updated")}</ItemInfo>
				</div>
			</Pane>
		</div>
	);
}

const ItemInfo = ({ label, children }: { label: string; children: ReactNode }) => {
	return (
		<div className="flex flex-col mb-2">
			<span className="text-sm font-semibold text-gray-600 mb-1">{label}</span>
			<span className="pl-2 text-sm tracking-normal text-gray-500">{children}</span>
		</div>
	);
};
