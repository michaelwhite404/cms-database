import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectMainArea from "./ProjectMainArea";
import { CollectionModel } from "../../../../src/interfaces/collectionInterfaces";
import AppError from "../../../../src/utils/appError";
import AppContainer from "../../components/AppContainer/AppContainer";
import Heading from "../../components/AppContainer/Heading";
import { APICollectionResponse, APIDatabaseRepsonse } from "../../interfaces/APIResponse";
import HeadingButtons from "./HeadingButtons";
import DatabaseModel from "../../../../src/interfaces/databaseInterface";
import Slideover from "../../components/Slideover";
import CreateCollectionSlideover from "./CreateCollectionSlideover";

export default function Project() {
	const [openSlideover, setOpenSlideover] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [currentDatabase, setCurrentDatabase] = useState<DatabaseModel | null>(null);
	const [collections, setCollections] = useState<CollectionModel[]>([]);
	const [activeCollection, setActiveCollection] = useState<DatabaseModel | {}>({});
	const params = useParams<{ database: string }>();

	const fetchData = async () => {
		try {
			const [res1, res2] = await Promise.all([
				axios.get<APICollectionResponse>(
					`/api/v1/databases/${params.database}/collections?slug=true`
				),
				axios.get<APIDatabaseRepsonse>(`/api/v1/databases/${params.database}?slug=true`),
			]);
			setCollections(res1.data.collections);
			setCurrentDatabase(res2.data.database);
			setTimeout(() => setLoaded(true), 750);
		} catch (err) {
			console.log((err as AxiosError<AppError>).response!.data);
		}
	};
	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AppContainer>
			<>
				<Heading loaded={loaded} title={`${currentDatabase ? currentDatabase.name : ""}`}>
					<HeadingButtons loaded={loaded} />
				</Heading>
				<ProjectMainArea
					activeCollection={activeCollection}
					setActiveCollection={setActiveCollection}
					collections={collections}
					loaded={loaded}
				/>
				<Slideover size="4xl" open={openSlideover} setOpen={setOpenSlideover}>
					<CreateCollectionSlideover setOpen={setOpenSlideover} />
				</Slideover>
			</>
		</AppContainer>
	);
}
