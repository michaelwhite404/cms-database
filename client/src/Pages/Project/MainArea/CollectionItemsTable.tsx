import { TiPin } from "react-icons/ti";
import { ItemModel } from "../../../../../src/interfaces/itemInterfaces";
import FieldDisplay from "../../../interfaces/FieldDisplay";
import CollectionItemsRow from "./CollectionItemsRow";

export default function CollectionItemsTable({
	items,
	fieldDisplay,
}: {
	items?: ItemModel[];
	fieldDisplay: FieldDisplay[];
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
									className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									key={field.slug}
								>
									{field.name}
								</th>
							))}
						<th className="py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
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
							/>
						))}
				</tbody>
			</table>
		</div>
	);
}
