import RoundedArrow from "../../../components/Icons/RoundedArrow";

export default function AddCollectionBox() {
	return (
		<div className="p-4 w-full">
			<div className="relative flex justify-center w-full p-4 bg-gray-100 rounded-md text-xs text-gray-500 border-2 ">
				Create your first collection!
				<div
					className="absolute right-2 -top-3 text-gray-400"
					style={{ transform: "rotate(-70deg)" }}
				>
					<RoundedArrow width={30} height={30} />
				</div>
			</div>
		</div>
	);
}
