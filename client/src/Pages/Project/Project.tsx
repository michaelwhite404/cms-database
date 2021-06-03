import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
			const res = await axios.get<APICollectionResponse>(
				`/api/v1/databases/${params.database}/collections?slug=true`
			);
			console.log(res);
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
				<ul>
					{collections.map((collection) => (
						<li key={collection._id}>
							<div>{collection.name}</div>
							<div>{collection.createdAt}</div>
							<div>{collection.slug}</div>
							<div>{collection._id}</div>
							<hr />
						</li>
					))}
				</ul>
			</>
		</AppContainer>
	);
}
