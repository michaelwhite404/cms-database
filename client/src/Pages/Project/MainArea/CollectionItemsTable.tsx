import { ItemModel } from "../../../../../src/interfaces/itemInterfaces";

export default function CollectionItemsTable({ items }: { items: ItemModel[] | undefined }) {
	return (
		<div className="overflow-auto" style={{ height: "calc(100% - 40px)" }}>
			<table className="min-w-full">
				<thead>
					<tr className="border-t border-gray-200">
						<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Name
						</th>
						<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Created
						</th>
						<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Modified
						</th>
					</tr>
				</thead>
				<tbody className="text-xs">
					{items &&
						items.map((i) => (
							<tr key={i._id as string}>
								<td className="pl-6">{i["business-name"]}</td>
								<td>{new Date(i["created-on"]).toLocaleString()}</td>
								<td>{new Date(i["updated-on"]).toLocaleString()}</td>
							</tr>
						))}
				</tbody>
			</table>
			{/* {items &&
				items.map((i) => (
					<div className="border-2">
						{Object.entries(i).map(([k, v]) => (
							<div>{`${k}:${v}`}</div>
						))}
					</div>
				))} */}
		</div>
	);
}
