import pluralize from "pluralize";
import React, { useState, useEffect, useContext, useRef } from "react";
import slugify from "slugify";
import { v4 as uuid } from "uuid";
import { PlusIcon } from "@heroicons/react/solid";
import { CollectionDataFields } from "../../../../src/interfaces/collectionDataInterfaces";
import Pane from "../../components/Pane";
import CountableBadge from "./CountableBadge";
import FullCollectionURL from "./Slideover/FullCollectionURL";
import SlideoverHeading from "./Slideover/SlideoverHeading";
import StandardInput from "../../components/Form/StandardInput";
import CollectionFieldRow from "./Slideover/CollectionFieldRow";
import axios from "axios";
import DatabaseModel from "../../../../src/interfaces/databaseInterface";
import AddFieldRow from "./Slideover/AddFieldRow";
import BasicFieldRow from "./Slideover/BasicFieldRow";
import {
	CollectionModel,
	CollectionValidationOption,
	CollectionValidations,
} from "../../../../src/interfaces/collectionInterfaces";
import NewCollectionContext from "../../context/NewCollectionContext";
import { APICollectionResponse } from "../../interfaces/APIResponse";

interface CreateCollectionSlideoverProps {
	database: DatabaseModel;
	collections: CollectionModel[];
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setCollections: React.Dispatch<React.SetStateAction<CollectionModel[]>>;
	setActiveCollection: React.Dispatch<React.SetStateAction<CollectionModel | null>>;
}

export default function CreateCollectionSlideover({
	setOpen,
	database,
	collections,
	setCollections,
	setActiveCollection,
}: CreateCollectionSlideoverProps) {
	// const NewCollectionContext = createContext<>([defaultCollectionData, dispatch]);
	const [newCollectionData, setNewCollectionData] = useContext(NewCollectionContext);
	const [activeField, setActiveField] = useState<CollectionDataFields | null>(null);
	const [addField, setAddField] = useState({
		tempId: uuid(),
		name: "",
		type: undefined,
		helpText: "",
		required: false,
		validations: {},
	});
	const editted = useRef(false);
	const [errors, setErrors] = useState({ name: "", slug: "" });

	const basicInfoFields = newCollectionData.fields.slice(0, 2);
	const customFields = newCollectionData.fields.slice(2);

	useEffect(() => {
		const slugLow = (value: string) => slugify(value, { lower: true });
		let name = collections.map((c) => slugLow(c.name)).includes(slugLow(newCollectionData.name))
			? "Already Exists"
			: "";
		if (editted.current && !newCollectionData.name) name = "This field is required";
		let slug = collections.map((c) => c.slug).includes(newCollectionData.slug)
			? " Collection with this URL Already Exists"
			: "";
		if (editted.current && !newCollectionData.slug) slug = "This field is required";
		setErrors({ name, slug });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newCollectionData.name, newCollectionData.slug]);

	/** Value stores if the form can be submitted */
	const submittable =
		Object.values(errors).join("").length === 0 &&
		newCollectionData.name.length &&
		newCollectionData.slug.length &&
		activeField === null;

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

	/**
	 * Remove any validations that have empty string
	 * @param fields - Array of collection fields
	 * @returns Collection fields with removed validations
	 */
	const removeEmptyValidations = (collectionFields: CollectionDataFields[]) => {
		const fields = collectionFields.concat();
		const newFields: CollectionDataFields[] = [];
		fields.forEach((field) => {
			const validations: CollectionValidations<any> = {};
			for (const val in field.validations!) {
				// @ts-ignore
				validations[val] = field.validations[val] === "" ? undefined : field.validations[val];
			}
			const createField = { ...field, validations };
			newFields.push(createField);
		});
		return newFields;
	};

	const manipulateOptions = (collectionFields: CollectionDataFields[]) => {
		const fields = collectionFields.concat();
		const newFields: CollectionDataFields[] = [];
		fields.forEach((field) => {
			if (field.type !== "Option") newFields.push(field);
			else {
				const options = field.validations!.options as CollectionValidationOption[];
				field.validations!.options = options.map((o) => o.name);
				newFields.push(field);
			}
		});
		return newFields;
	};

	const finalizedFields = () => {
		const step1 = removeEmptyValidations(newCollectionData.fields);
		const final = manipulateOptions(step1);
		return final;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement> & React.KeyboardEvent) => {
		e.preventDefault();
		const fields = finalizedFields();
		if (!submittable) return;
		try {
			const res = await axios.post<APICollectionResponse>("/api/v1/collections", {
				database: database._id,
				...newCollectionData,
				fields,
			});
			const { collection } = res.data;
			const newCollections = [...collections];
			newCollections.unshift(collection);
			console.log(res.data);
			setCollections(newCollections);
			setOpen(false);
			setActiveCollection(collection);
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
		if (!editted.current) editted.current = true;
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
								errorMessage={errors.name}
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
								errorMessage={errors.slug}
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
						<div className="flex justify-end xs:mt-4 absolute right-6 top-5">
							<button
								type="button"
								className={`${
									!activeField
										? "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
										: "bg-blue-400 cursor-not-allowed"
								} ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white focus:outline-none`}
								// @ts-ignore
								onClick={() => !activeField && setActiveField(addField)}
							>
								<PlusIcon className="mr-1.5" width={16} />
								Add New Field
							</button>
						</div>
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
					className={`${
						submittable
							? "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							: "bg-indigo-400 cursor-not-allowed"
					} ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none `}
				>
					Save
				</button>
			</div>
		</form>
	);
}
