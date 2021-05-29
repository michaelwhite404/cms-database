import React, { useState } from "react";
import DesktopSidebar from "../Sidebar/DesktopSidebar";
import MobileSidebar from "../Sidebar/MobileSidebar";

export default function Project() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="h-screen flex overflow-hidden bg-white">
			<MobileSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

			{/* Static sidebar for desktop */}
			<DesktopSidebar />
		</div>
	);
}
