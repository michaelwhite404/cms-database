import React, { useState } from "react";
import MainSection from "./MainSection";
import DesktopSidebar from "../Sidebar/DesktopSidebar";
import MobileSidebar from "../Sidebar/MobileSidebar";

interface AppContainerProps {
	children: JSX.Element;
}

export default function AppContainer({ children }: AppContainerProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="h-screen flex overflow-hidden bg-white">
			{/* Sidebar for smaller breakpoints */}
			<MobileSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

			{/* Static sidebar for desktop */}
			<DesktopSidebar />

			{/* Main section for content */}
			<MainSection setSidebarOpen={setSidebarOpen}>{children}</MainSection>
		</div>
	);
}
