import { LinkIcon } from "@heroicons/react/solid";
import slugify from "slugify";
import MiniBadge from "../../../components/MiniBadge";

interface FullCollectionURLProps {
	data: {
		name: string;
		slug: string;
		pluralName: string;
		singularName: string;
	};
}

export default function FullCollectionURL({ data }: FullCollectionURLProps) {
	const folderName = data.slug || slugify(data.name, { lower: true }) || "items";
	const pageName = `/${slugify(data.singularName, { lower: true })}-page`;
	return (
		<div>
			<MiniBadge>
				<span className="flex text-gray-500">
					<LinkIcon className="w-3 mr-2 ml-1" />
					<span>mywebsite.com/</span>
					<span className="text-indigo-600">{folderName}</span>
					<span>{pageName}</span>
				</span>
			</MiniBadge>
		</div>
	);
}
