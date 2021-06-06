import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectMainArea from "./ProjectMainArea";
import { CollectionModel } from "../../../../src/interfaces/collectionInterfaces";
import AppError from "../../../../src/utils/appError";
import AppContainer from "../../components/AppContainer/AppContainer";
import Heading from "../../components/AppContainer/Heading";
import { APICollectionResponse } from "../../interfaces/APIResponse";
import HeadingButtons from "./HeadingButtons";

export default function Project() {
	const [collections, setCollections] = useState<CollectionModel[]>([]);

	const params = useParams<{ database: string }>();
	const fetchData = async () => {
		try {
			// await Promise.all()
			const res = await axios.get<APICollectionResponse>(
				`/api/v1/databases/${params.database}/collections?slug=true`
			);
			setCollections(res.data.collections);
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
				<Heading title="Project">
					<HeadingButtons />
				</Heading>
				<ProjectMainArea collections={collections} />
			</>
		</AppContainer>
	);
}
