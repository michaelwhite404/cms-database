import { CollectionModel } from "../../../../../src/interfaces/collectionInterfaces";

export default function NoItemsBox({ activeCollection }: { activeCollection: CollectionModel }) {
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
							<button className="py-2 px-7 bg-gray-50 text-sm rounded-md mr-3 border border-gray-200">
								Add 5 items
							</button>
							<button className="py-2 px-7 bg-gray-50 text-sm rounded-md mr-3 border border-gray-200">
								Add 10 items
							</button>
							<button className="py-2 px-7 bg-gray-50 text-sm rounded-md border border-gray-200">
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
