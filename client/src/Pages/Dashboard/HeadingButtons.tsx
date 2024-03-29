interface HeadingButtonsProps {
	setOpenSlideover: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeadingButtons({ setOpenSlideover }: HeadingButtonsProps) {
	return (
		<>
			<button
				type="button"
				className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-1 sm:ml-3"
				onClick={() => setOpenSlideover(true)}
			>
				+ Create New Project
			</button>
		</>
	);
}
