import SearchHeader from "./SearchHeader";

interface MainSectionProps {
	setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
	children: JSX.Element;
}

export default function MainSection({ children, setSidebarOpen }: MainSectionProps) {
	return (
		<div className="flex flex-col w-0 flex-1 overflow-hidden">
			<SearchHeader setSidebarOpen={setSidebarOpen} />
			<main className="flex flex-col flex-1 relative z-0 focus:outline-none h-screen">
				{children}
			</main>
		</div>
	);
}
