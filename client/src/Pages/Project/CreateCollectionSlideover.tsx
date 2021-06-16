import pluralize from "pluralize";
import React, { useState } from "react";
import slugify from "slugify";
import { v4 as uuid } from "uuid";
import CollectionData, {
	CollectionDataFields,
} from "../../../../src/interfaces/collectionDataInterfaces";
import Pane from "../../components/Pane";
import CountableBadge from "./CountableBadge";
import FullCollectionURL from "./Slideover/FullCollectionURL";
import SlideoverHeading from "./Slideover/SlideoverHeading";
import StandardInput from "./Slideover/StandardInput";
import CollectionFieldRow from "./Slideover/CollectionFieldRow";
import defaultCollectionData from "../../utils/defaultCollectionData";
import axios from "axios";
import DatabaseModel from "../../../../src/interfaces/databaseInterface";
import AddFieldRow from "./Slideover/AddFieldRow";
import BasicFieldRow from "./Slideover/BasicFieldRow";

interface CreateCollectionSlideoverProps {
	database: DatabaseModel;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateCollectionSlideover({
	setOpen,
	database,
}: CreateCollectionSlideoverProps) {
	const [newCollectionData, setNewCollectionData] = useState<CollectionData>(defaultCollectionData);
	const [activeField, setActiveField] = useState<CollectionDataFields | null>(null);
	const [addField, setAddField] = useState({
		tempId: uuid(),
		name: "",
		type: undefined,
		helpText: "",
		required: false,
		validations: { singleLine: true, minLength: "", maxLength: "" },
	});

	const basicInfoFields = newCollectionData.fields.slice(0, 2);
	const customFields = newCollectionData.fields.slice(2);

	const submitField = (tempId: string) => {
		const copiedFields = [...newCollectionData.fields];
		const index = copiedFields.findIndex((field) => field.tempId === tempId);
		copiedFields[index] = activeField!;
		setNewCollectionData({ ...newCollectionData, fields: copiedFields });
		setActiveField(null);
	};

	const submitNewField = () => {
		const copiedFields = [...newCollectionData.fields];
		copiedFields.push(activeField!);
		setNewCollectionData({ ...newCollectionData, fields: copiedFields });
		setActiveField(null);
		setAddField({ ...addField, tempId: uuid() });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement> & React.KeyboardEvent) => {
		e.preventDefault();
		try {
			const res = await axios.post("/api/v1/collections", {
				database: database._id,
				...newCollectionData,
			});
			console.log(res.data);
		} catch (err) {
			console.log(err.response.data);
		}
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

	/**
	 * Manually change the validation field
	 * @param name The name of the validation field
	 * @param value The new value of the validation
	 */
	const changeValidationField = (name: string, value: any) => {
		setActiveField({
			...activeField!,
			validations: {
				...activeField?.validations,
				[name]: value,
			},
		});
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
								placeholder="E.g. Blog Posts"
								required
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
								required
								placeholder="E.g. posts"
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
							<div className="block w-full shadow-sm border rounded-md overflow-hidden">
								{basicInfoFields.map((field) => (
									<BasicFieldRow
										key={field.tempId}
										field={field}
										active={field.tempId === activeField?.tempId}
										activeField={activeField}
										setActiveField={setActiveField}
										submitField={submitField}
										changeValidationField={changeValidationField}
									/>
								))}
							</div>
						</Pane.Item>
						<Pane.Item>
							<div className="mb-3">Custom Fields</div>
							<div className="block w-full shadow-sm border rounded-md overflow-hidden">
								{customFields.map((field) => (
									<CollectionFieldRow
										key={field.tempId}
										field={field}
										active={field.tempId === activeField?.tempId}
										activeField={activeField}
										setActiveField={setActiveField}
										submitField={submitField}
										changeValidationField={changeValidationField}
									/>
								))}
								<AddFieldRow
									field={addField}
									active={addField.tempId === activeField?.tempId}
									activeField={activeField}
									setActiveField={setActiveField}
									submitField={submitField}
									submitNewField={submitNewField}
									changeValidationField={changeValidationField}
								/>
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
