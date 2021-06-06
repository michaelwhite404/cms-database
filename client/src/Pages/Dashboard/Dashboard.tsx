import axios from "axios";
import React, { useEffect, useState } from "react";
import AppContainer from "../../components/AppContainer/AppContainer";
import Heading from "../../components/AppContainer/Heading";
import { APIDashboardResponse, APIPinnedResponse } from "../../interfaces/APIResponse";
import DashboardDatabase from "../../interfaces/DashboardDatabase";
import HeadingButtons from "./HeadingButtons";
import ProjectsList from "./ProjectsList";
import PinnedProjects from "./PinnedProjects";
import ProjectsTable from "./ProjectsTable";
import SuccessNotification from "../../components/SuccessNotification";
import DeleteModal from "../../components/DeleteModal";
import Slideover from "../../components/Slideover";
import CreateProjectSlideover from "./Slideover/CreateProjectSlideover";
import ShareModal from "../../components/ShareModal";

export default function Dashboard() {
	const [projects, setProjects] = useState<DashboardDatabase[]>([]);
	const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState<[string, string?]>([""]);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<DashboardDatabase>(
		{} as DashboardDatabase
	);
	const [openSlideover, setOpenSlideover] = useState(false);
	const [sharedUsers, setSharedUsers] = useState({});

	const pinnedProjects = projects.filter((project) => project.pinned);

	const fetchProjects = async () => {
		try {
			const res = await axios.get<APIDashboardResponse>("/api/v1/ui/dashboard");
			setProjects(res.data.databases);
		} catch (err) {
			console.log(err);
		}
	};

	const togglePin = async (databaseId: string) => {
		try {
			const res = await axios.patch<APIPinnedResponse>(
				`/api/v1/databases/roles/pinned/${databaseId}`
			);
			const { pinned } = res.data;
			const index = projects.findIndex((p) => p._id === databaseId);
			if (index < 0) return;
			let editProjects = [...projects];
			editProjects[index].pinned = pinned;
			setProjects(editProjects);
		} catch (err) {
			console.log(err);
		}
	};

	/**
	 * Deletes a database by the database ID
	 * @param databaseId The ID of database being deleted
	 */
	const deleteProject = async (databaseId: string) => {
		try {
			await axios.delete(`/api/v1/databases/${databaseId}`);
			const newProjects = projects.filter((p) => p._id !== databaseId);
			setSuccessMessage(["Project Deleted Successfully"]);
			setSuccessNotificationOpen(true);
			setTimeout(() => {
				setSuccessNotificationOpen(false);
				setSuccessMessage([""]);
			}, 3500);
			setProjects(newProjects);
		} catch (err) {
			console.log(err.response.data);
		}
	};

	useEffect(() => {
		document.title = "Dashboard";
		fetchProjects();
	}, []);

	return (
		<AppContainer>
			<>
				{/* Page title & actions */}
				<Heading title="Dashboard">
					<HeadingButtons setOpenSlideover={setOpenSlideover} />
				</Heading>

				{/* Pinned projects */}
				<PinnedProjects projects={pinnedProjects} togglePin={togglePin} />

				{/* Projects list (only on smallest breakpoint) */}
				<ProjectsList projects={projects} />

				{/* Projects table (small breakpoint and up) */}
				<ProjectsTable
					projects={projects}
					setOpenDeleteModal={setOpenDeleteModal}
					setProjectToDelete={setProjectToDelete}
					togglePin={togglePin}
				/>

				{/* Success Notification */}
				<SuccessNotification show={successNotificationOpen} setShow={setSuccessNotificationOpen}>
					{successMessage}
				</SuccessNotification>

				{/* Delete Modal */}
				<DeleteModal
					open={openDeleteModal}
					project={projectToDelete}
					setOpenDeleteModal={setOpenDeleteModal}
					deleteProject={deleteProject}
				/>

				{/* Share Modal */}
				{/* <ShareModal /> */}

				<Slideover size="md" open={openSlideover} setOpen={setOpenSlideover}>
					<CreateProjectSlideover
						setOpen={setOpenSlideover}
						setProjects={setProjects}
						projects={projects}
					/>
				</Slideover>
			</>
		</AppContainer>
	);
}
