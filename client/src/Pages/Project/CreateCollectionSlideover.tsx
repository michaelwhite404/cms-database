import pluralize from "pluralize";
import React, { useState } from "react";
import slugify from "slugify";
import CollectionData from "../../../../src/interfaces/collectionDataInterfaces";
import Pane from "../../components/Pane";
import CountableBadge from "./CountableBadge";
import FullCollectionURL from "./Slideover/FullCollectionURL";
import SlideoverHeading from "./Slideover/SlideoverHeading";
import StandardInput from "./Slideover/StandardInput";
import PlainTextIcon from "../../components/PlainTextIcon";
import CollectionFieldRow from "./CollectionFieldRow";

interface CreateCollectionSlideoverProps {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateCollectionSlideover({ setOpen }: CreateCollectionSlideoverProps) {
	const [newCollectionData, setNewCollectionData] = useState<CollectionData>({
		name: "",
		slug: "",
		pluralName: "Items",
		singularName: "Item",
		fields: [
			{ name: "Name", type: "PlainText", required: true, primaryName: true },
			{ name: "Slug", type: "PlainText", required: true, primarySlug: true },
		],
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setNewCollectionData({
			...newCollectionData,
			name,
			slug: slugify(name, { lower: true }),
			pluralName: pluralize(name) || "Items",
			singularName: pluralize.singular(name) || "Item",
		});
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement & HTMLSpanElement>) => {
		setNewCollectionData({ ...newCollectionData, [e.target!.name]: e.target!.value });
	};

	return (
		<form
			className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
			onSubmit={handleSubmit}
		>
			<div className="flex-1 h-0 overflow-y-auto">
				{/* Slideover heading */}
				<SlideoverHeading setOpen={setOpen} />
				<div className="flex-1 flex flex-col justify-between divide-y divide-gray-200 py-4">
					<Pane>
						<Pane.Title>Collection Settings</Pane.Title>
						<Pane.Item>
							<StandardInput
								title="Collection Name"
								name="name"
								handleChange={handleNameChange}
								value={newCollectionData.name}
							/>
							{/* Singular and plural badges */}
							<div>
								<CountableBadge name={newCollectionData.singularName} type="singular" />
								<CountableBadge name={newCollectionData.pluralName} type="plural" margin />
							</div>
						</Pane.Item>
						<Pane.Item>
							<StandardInput
								title="Collection URL"
								name="slug"
								handleChange={handleChange}
								value={newCollectionData.slug}
								handleBlur={() =>
									setNewCollectionData({
										...newCollectionData,
										slug: slugify(newCollectionData.slug, { lower: true }),
									})
								}
							/>
							<FullCollectionURL data={newCollectionData} />
						</Pane.Item>
					</Pane>
					<Pane>
						<Pane.Title>Collection Fields</Pane.Title>
						<Pane.Item>
							<div className="mb-3">Basic Info</div>
							<div className="block w-full shadow-sm border rounded-md">
								<CollectionFieldRow name="Name" type="PlainText" />
								<CollectionFieldRow name="Slug" type="PlainText" />
								<div
									className="flex items-center border-b py-2.5 px-4 text-xs text-gray-700"
									style={{ userSelect: "none" }}
								>
									<PlainTextIcon className="mr-3" />
									<span className="mr-3">Name</span>
									<span className="text-gray-400">(Plain Text)</span>
									<span className="text-gray-400 ml-auto">Required Field</span>
								</div>
								<div
									className="flex items-center border-b-0 py-2.5 px-4 text-xs text-gray-700"
									style={{ userSelect: "none" }}
								>
									<PlainTextIcon className="mr-3" />
									<span className="mr-3">Slug</span>
									<span className="text-gray-400">(Plain Text)</span>
									<span className="text-gray-400 ml-auto">Required Field</span>
								</div>
							</div>
						</Pane.Item>
					</Pane>
				</div>
			</div>
			<div className="flex-shrink-0 px-4 py-4 flex justify-end">
				<button
					type="button"
					className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					onClick={() => setOpen(false)}
				>
					Cancel
				</button>
				<button
					type="submit"
					className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					Save
				</button>
			</div>
		</form>
	);
}
