import { TiPin } from "react-icons/ti";
import { ItemModel } from "../../../../../src/interfaces/itemInterfaces";
import FieldDisplay from "../../../interfaces/FieldDisplay";
import CollectionItemsRow from "./CollectionItemsRow";

export default function CollectionItemsTable({
	items,
	fieldDisplay,
	setActiveItem,
}: {
	items?: ItemModel[];
	fieldDisplay: FieldDisplay[];
	setActiveItem: React.Dispatch<React.SetStateAction<ItemModel | null>>;
}) {
	return (
		<div className="overflow-auto" style={{ height: "calc(100% - 55px)" }}>
			<table className="min-w-full">
				<thead>
					<tr className="border-t border-gray-200 bg-gray-100 ">
						{fieldDisplay
							.filter((f) => f.show === true)
							.map((field) => (
								<th
									style={{ boxShadow: "inset 0px -1px 0px 0px #e5e5e5" }}
									className="px-6 py-3 sticky top-0 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									key={field.slug}
								>
									{field.name}
								</th>
							))}
						<th
							className="py-3 sticky top-0 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase"
							style={{ boxShadow: "inset 0px -1px 0px 0px #e5e5e5" }}
						>
							<TiPin />
						</th>
					</tr>
				</thead>
				<tbody className="text-xs bg-white">
					{items &&
						items.map((item) => (
							<CollectionItemsRow
								fieldDisplay={fieldDisplay}
								item={item}
								key={item._id as string}
								onClick={() => setActiveItem(item)}
							/>
						))}
				</tbody>
			</table>
		</div>
	);
}
