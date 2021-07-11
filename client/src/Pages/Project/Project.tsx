import axios, { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectMainArea from "./ProjectMainArea";
import { CollectionModel } from "../../../../src/interfaces/collectionInterfaces";
import AppError from "../../../../src/utils/appError";
import AppContainer from "../../components/AppContainer/AppContainer";
import Heading from "../../components/AppContainer/Heading";
import {
	APICollectionResponse,
	APICollectionWithItemsResponse,
	APIDatabaseRepsonse,
} from "../../interfaces/APIResponse";
import HeadingButtons from "./HeadingButtons";
import DatabaseModel from "../../../../src/interfaces/databaseInterface";
import Slideover from "../../components/Slideover";
import CreateCollectionSlideover from "./CreateCollectionSlideover";
import { NewCollectionProvider } from "../../context/NewCollectionContext";
import ProjectCollectionsContext from "../../context/ProjectCollectionsContext";
import FieldDisplay from "../../interfaces/FieldDisplay";
import { CollectionWithItems } from "../../interfaces/CollectionWithItems";
import EditCollectionSlideover from "./EditCollectionSlideover";
import { ItemModel } from "../../../../src/interfaces/itemInterfaces";

export default function Project() {
	const [openCreateSlideover, setOpenCreateSlideover] = useState(false);
	const [openEditSlideover, setOpenEditSlideover] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [currentDatabase, setCurrentDatabase] = useState<DatabaseModel | null>(null);
	const [collections, setCollections] = useContext(ProjectCollectionsContext);
	const [activeCollection, setActiveCollection] = useState<CollectionModel | null>(null);
	const [collectionItems, setCollectionItems] = useState<CollectionWithItems[] | null>(null);
	const [display, setDisplay] = useState<{ collectionId: string; fieldDisplay: FieldDisplay[] }[]>(
		[]
	);
	const [activeItem, setActiveItem] = useState<ItemModel | null>(null);
	const params = useParams<{ database: string }>();

	const fetchData = async () => {
		try {
			clear();
			const [res1, res2] = await Promise.all([
				axios.get<APICollectionResponse>(`/api/v1/databases/${params.database}/collections`, {
					params: { slug: true, fields: true },
				}),
				axios.get<APIDatabaseRepsonse>(`/api/v1/databases/${params.database}?slug=true`),
			]);
			const databaseId = res2.data.database._id;
			const res3 = await axios.get<APICollectionWithItemsResponse>(
				`/api/v1/ui/databases/${databaseId}`
			);
			setCollections(res1.data.collections);
			setCurrentDatabase(res2.data.database);
			setCollectionItems(res3.data.collections);
			const thisDisplay = res1.data.collections.map((c) => ({
				collectionId: c._id,
				fieldDisplay: c.fields.map(
					(f, i) =>
						({
							name: f.name,
							slug: f.slug,
							type: f.type,
							show: i === 0 || f.slug === "created-on" || f.slug === "updated-on",
						} as FieldDisplay)
				),
			}));
			setDisplay(thisDisplay);
			setTimeout(() => setLoaded(true), 750);
		} catch (err) {
			console.log((err as AxiosError<AppError>).response!.data);
		}
	};
	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.database]);

	const clear = () => {
		setLoaded(false);
		setCollections([]);
		setCurrentDatabase(null);
		setCollectionItems(null);
		setActiveCollection(null);
	};

	// TODO: Add items if collection is shown
	const addItemsToCollection = (collectionId: string, items: ItemModel[]) => {
		const index = collectionItems?.findIndex((ci) => ci.collectionId === collectionId);
		if (index === -1) {
			const newCollection = { collectionId, items } as CollectionWithItems;
			const copiedCIs = [...collectionItems!];
			copiedCIs.push(newCollection);
			setCollectionItems(copiedCIs);
		}
	};

	const getItemsByCollectionId = (collectionId?: string) =>
		collectionId
			? collectionItems?.find((ci) => ci.collectionId === collectionId)?.items
			: undefined;

	return (
		<AppContainer>
			<Heading loaded={loaded} title={`${currentDatabase ? currentDatabase.name : ""}`}>
				<HeadingButtons loaded={loaded} setOpenSlideover={setOpenCreateSlideover} />
			</Heading>
			<ProjectMainArea
				activeCollection={activeCollection}
				setActiveCollection={setActiveCollection}
				activeItem={activeItem}
				setActiveItem={setActiveItem}
				collections={collections}
				loaded={loaded}
				setCreateOpen={setOpenCreateSlideover}
				setEditOpen={setOpenEditSlideover}
				collectionItems={collectionItems}
				setCollectionItems={setCollectionItems}
				display={display}
				addItemsToCollection={addItemsToCollection}
				getItemsByCollectionId={getItemsByCollectionId}
			/>

			<Slideover size="4xl" open={openCreateSlideover} setOpen={setOpenCreateSlideover}>
				<NewCollectionProvider>
					<CreateCollectionSlideover
						setOpen={setOpenCreateSlideover}
						database={currentDatabase!}
						collections={collections}
						setCollections={setCollections}
						setActiveCollection={setActiveCollection}
					/>
				</NewCollectionProvider>
			</Slideover>

			<Slideover size="4xl" open={openEditSlideover} setOpen={setOpenEditSlideover}>
				<EditCollectionSlideover
					setOpen={setOpenEditSlideover}
					activeCollection={activeCollection!}
				/>
			</Slideover>
		</AppContainer>
	);
}
