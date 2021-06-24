import { TiPin } from "react-icons/ti";
import { CollectionFieldType } from "../../../../../src/interfaces/collectionInterfaces";
import { ItemModel } from "../../../../../src/interfaces/itemInterfaces";
import CollectionItemsRow from "./CollectionItemsRow";

interface FieldDisplay {
	type: CollectionFieldType;
	slug: string;
	name: string;
	show: boolean;
}

const fieldDisplay: FieldDisplay[] = [
	{ name: "Business Name", type: "PlainText", slug: "business-name", show: true },
	{ name: "Slug", type: "PlainText", slug: "slug", show: false },
	{ name: "Color", type: "Color", slug: "color", show: false },
	{ name: "Featured?", type: "Bool", slug: "featured", show: false },
	{ name: "Rating", type: "Number", slug: "rating", show: false },
	{ name: "Created On", type: "Date", slug: "created-on", show: true },
	{ name: "Updated On", type: "Date", slug: "updated-on", show: true },
	{ name: "Created By", type: "User", slug: "created-by", show: false },
	{ name: "Updated By", type: "User", slug: "updated-by", show: false },
];

export default function CollectionItemsTable({ items }: { items: ItemModel[] | undefined }) {
	return (
		<div className="overflow-auto" style={{ height: "calc(100% - 40px)" }}>
			<table className="min-w-full">
				<thead>
					<tr className="border-t border-gray-200 bg-gray-100 ">
						{fieldDisplay
							.filter((f) => f.show === true)
							.map((field) => (
								<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									{field.name}
								</th>
							))}
						<th className="py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
							<TiPin />
						</th>
						{/* <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Name
						</th>
						<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Created
						</th>
						<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Modified
						</th> */}
					</tr>
				</thead>
				<tbody className="text-xs bg-white">
					{items &&
						items.map((item) => <CollectionItemsRow fieldDisplay={fieldDisplay} item={item} />)}
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
