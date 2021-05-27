import Sidebar from "./Sidebar";

export default function DesktopSidebar() {
	return (
		<div className="hidden lg:flex lg:flex-shrink-0">
			<div className="flex flex-col w-64 border-r border-gray-200 pt-5 pb-4 bg-gray-100">
				<div className="flex items-center flex-shrink-0 px-6">
					<img
						className="h-8 w-auto"
						src="https://tailwindui.com/img/logos/workflow-logo-purple-500-mark-gray-700-text.svg"
						alt="Workflow"
					/>
				</div>
				{/* Sidebar component*/}
				<Sidebar />
			</div>
		</div>
	);
}
