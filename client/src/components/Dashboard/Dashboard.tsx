import { useState } from "react";
import Main from "./Main";
import DesktopSidebar from "../Sidebar/DesktopSidebar";
import MobileSidebar from "../Sidebar/MobileSidebar";
import SuccessNotification from "../SuccessNotification";

/* const navigation = [
	{ name: "Dashboard", href: "#", icon: HomeIcon, current: true },
	{ name: "Documentation", href: "#", icon: CodeIcon, current: false },
	{ name: "My tasks", href: "#", icon: ViewListIcon, current: false },
	{ name: "Recent", href: "#", icon: ClockIcon, current: false },
];
const teams = [
	{ name: "Engineering", href: "#", bgColorClass: "bg-indigo-500" },
	{ name: "Human Resources", href: "#", bgColorClass: "bg-green-500" },
	{ name: "Customer Success", href: "#", bgColorClass: "bg-yellow-500" },
]; */

export default function Example() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);

	return (
		<div className="h-screen flex overflow-hidden bg-white">
			<MobileSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

			{/* Static sidebar for desktop */}
			<DesktopSidebar />

			{/* Dashboard Content */}
			<Main
				setSidebarOpen={setSidebarOpen}
				setSuccessNotificationOpen={setSuccessNotificationOpen}
			/>

			<SuccessNotification show={successNotificationOpen} setShow={setSuccessNotificationOpen}>
				<div className="ml-3 w-0 flex-1 pt-0.5">
					<p className="text-sm font-medium text-gray-900">Project Successfully Deleted!</p>
				</div>
			</SuccessNotification>
		</div>
	);
}
