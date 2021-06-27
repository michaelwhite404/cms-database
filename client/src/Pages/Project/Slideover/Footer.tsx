interface FooterProps {
	submittable: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Footer({ submittable, setOpen }: FooterProps) {
	return (
		<div className="flex-shrink-0 px-4 py-4 flex justify-end">
			<button
				type="button"
				className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				onClick={() => setOpen(false)}
			>
				Cancel
			</button>
			<button
				type="submit"
				className={`${
					submittable
						? "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						: "bg-indigo-400 cursor-not-allowed"
				} ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none `}
			>
				Save
			</button>
		</div>
	);
}
