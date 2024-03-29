import axios from "axios";
import { useContext } from "react";
import { CollectionModel } from "../../../../../src/interfaces/collectionInterfaces";
import { ItemModel } from "../../../../../src/interfaces/itemInterfaces";
import SuccessNotificationContext from "../../../context/SuccessNotificationContext";

export default function NoItemsBox({
	activeCollection,
	addItemsToCollection,
}: {
	activeCollection: CollectionModel;
	addItemsToCollection: (collectionId: string, items: ItemModel[]) => void;
}) {
	const { animateSuccessNotification } = useContext(SuccessNotificationContext);
	const addItems = async (number: number) => {
		try {
			const res = await axios.post(
				`/api/v1/collections/${activeCollection._id}/items/fake/${number}`
			);
			console.log(res.data);
			addItemsToCollection(activeCollection._id, res.data.fakeItems);
			animateSuccessNotification(
				"Items successfully added",
				`${number} items have been added to '${activeCollection.name}'`
			);
		} catch (err) {
			console.log(err.response.data);
		}
	};

	return (
		<div
			className="w-full h-full flex items-center justify-center"
			style={{ height: "calc(100% - 55px" }}
		>
			<div style={{ flexBasis: "550px" }}>
				<div className="flex flex-col align-center border-4 border-dotted rounded-lg text-lg flex-grow">
					<div className="py-5 border-b-4 border-dotted">
						<span className="text-lg font-semibold text-gray-600 mt-2.5 flex justify-center">
							You have 0 {activeCollection.name} in this Collection
						</span>
					</div>
					<div className="p-5 flex flex-col items-center">
						<div className="text-lg font-semibold text-gray-600 pb-5">
							<span>Create sample items</span>
						</div>
						<div>
							<button
								className="py-2 px-7 bg-gray-50 text-sm rounded-md mr-3 border border-gray-200"
								onClick={() => addItems(5)}
							>
								Add 5 items
							</button>
							<button
								className="py-2 px-7 bg-gray-50 text-sm rounded-md mr-3 border border-gray-200"
								onClick={() => addItems(10)}
							>
								Add 10 items
							</button>
							<button
								className="py-2 px-7 bg-gray-50 text-sm rounded-md border border-gray-200"
								onClick={() => addItems(20)}
							>
								Add 20 items
							</button>
						</div>
						<div className="mt-4 text-xs text-center">
							<span>Sample items can help you start designing faster.</span>
							<br />
							Or you can{" "}
							<span className="underline cursor-pointer">
								create a new {activeCollection.singularName}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
