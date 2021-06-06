import { DatabaseIcon } from "@heroicons/react/solid";
import Skeleton from "react-loading-skeleton";

export default function FakeCollectionSidebarButton() {
	return (
		<div
			className={"flex border-b-2 p-4 items-center text-gray-200"}
			style={{ userSelect: "none" }}
		>
			<DatabaseIcon className="w-4 mr-2 " />
			<Skeleton width={100} height={16} />
			<div className="flex relative top-1">
				<Skeleton width={50} height={10} className="ml-2" />
			</div>
		</div>
	);
}
