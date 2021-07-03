import React, { useContext, useState } from "react";
import { CollectionField, CollectionModel } from "../../../../src/interfaces/collectionInterfaces";
import StandardInput from "../../components/Form/StandardInput";
import Pane from "../../components/Pane";
import SuccessNotificationContext from "../../context/SuccessNotificationContext";
import CountableBadge from "./CountableBadge";
import BasicFieldRow from "./Slideover/BasicFieldRow";
import Footer from "./Slideover/Footer";
import FullCollectionURL from "./Slideover/FullCollectionURL";
import SlideoverHeading from "./Slideover/SlideoverHeading";

interface EditCollectionSlideoverProps {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	activeCollection: CollectionModel;
}

export default function EditCollectionSlideover({
	setOpen,
	activeCollection,
}: EditCollectionSlideoverProps) {
	const { animateSuccessNotification } = useContext(SuccessNotificationContext);
	const [errors, setErrors] = useState({ name: "", slug: "" });
	const [activeField, setActiveField] = useState<CollectionField | null>(null);

	const basicInfoFields = activeCollection.fields.slice(0, 2);

	const submittable = false;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		return;
	};

	const handleChange = () => {};
	const handleNameChange = () => {};

	const submitField = (id: string) => {
		/* 
		const copiedFields = [...newCollectionData.fields];
		const index = copiedFields.findIndex((field) => field.tempId === tempId);
		copiedFields[index] = activeField!;
		setNewCollectionData({ ...newCollectionData, fields: copiedFields });
		setActiveField(null);
	 */
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
								value={activeCollection.name}
								placeholder="E.g. Blog Posts"
								errorMessage={errors.name}
								required
							/>
							{/* Singular and plural badges */}
							<div>
								<CountableBadge name={activeCollection.singularName} type="singular" />
								<CountableBadge name={""} type="plural" margin />
							</div>
						</Pane.Item>
						<Pane.Item>
							<StandardInput
								title="Collection URL"
								name="slug"
								handleChange={handleChange}
								value={activeCollection.slug}
								required
								placeholder="E.g. posts"
								errorMessage={errors.slug}
								/* handleBlur={() =>
									setNewCollectionData({
										...newCollectionData,
										slug: slugify(newCollectionData.slug, { lower: true }),
									})
								} */
							/>
							{/* <FullCollectionURL data={activeCollection} /> */}
						</Pane.Item>
					</Pane>
					<Pane>
						<Pane.Title>Collection Fields</Pane.Title>
						<Pane.Item>
							<div className="mb-3">Basic Info</div>
							<div className="block w-full shadow-sm border rounded-md overflow-hidden">
								{/* {basicInfoFields.map((field) => (
									<BasicFieldRow
										key={field._id as string}
										//@ts-ignore
										field={field}
										active={field._id === activeField?._id}
										activeField={activeField}
										setActiveField={setActiveField}
										submitField={submitField}
									/>
								))} */}
							</div>
						</Pane.Item>
						<Pane.Item>
							<div className="mb-3">Custom Fields</div>
							<div className="block w-full shadow-sm border rounded-md overflow-hidden"></div>
						</Pane.Item>
					</Pane>
				</div>
			</div>
			<Footer submittable={submittable} setOpen={setOpen} />
		</form>
	);
}
