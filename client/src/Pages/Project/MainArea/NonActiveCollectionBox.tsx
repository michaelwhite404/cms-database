interface Props {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NonActiveCollectionBox({ setOpen }: Props) {
	return (
		<div className="flex flex-col align-center border-4 border-dotted rounded-lg px-24 py-12">
			<span className="flex justify-center">
				Select a collection <span className="font-bold ml-1">OR</span>
			</span>
			<button
				type="button"
				className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-1 sm:mt-3"
				onClick={() => setOpen(true)}
			>
				+ Create New Collection
			</button>
		</div>
	);
}
