import axios from "axios";
import React, { useEffect, useState } from "react";
import AppContainer from "../../components/AppContainer/AppContainer";
import Heading from "../../components/AppContainer/Heading";
import { APIDashboardResponse } from "../../interfaces/APIResponse";
import DashboardDatabase from "../../interfaces/DashboardDatabase";
import HeadingButtons from "./HeadingButtons";
import ProjectsList from "./ProjectsList";
import PinnedProjects from "./PinnedProjects";
import ProjectsTable from "./ProjectsTable";
import SuccessNotification from "../../components/SuccessNotification";
import DeleteModal from "../../components/DeleteModal";

export default function Dashboard() {
	const [projects, setProjects] = useState<DashboardDatabase[]>([]);
	const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState<[string, string?]>([""]);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [deleteProjectId, setDeleteProjectId] = useState("");

	const pinnedProjects = projects.filter((project) => project.pinned);

	const fetchProjects = async () => {
		try {
			const res = await axios.get<APIDashboardResponse>("/api/v1/ui/dashboard");
			setProjects(res.data.databases);
		} catch (err) {
			console.log(err);
		}
	};

	const removePin = async (databaseId: string) => {
		try {
			await axios.patch(`/api/v1/databases/roles/pinned/${databaseId}`);
			const index = projects.findIndex((p) => p._id === databaseId);
			if (index < 0) return;
			let editProjects = [...projects];
			editProjects[index].pinned = false;
			setProjects(editProjects);
		} catch (err) {
			console.log(err);
		}
	};

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
		fetchProjects();
	}, []);

	return (
		<AppContainer>
			<>
				{/* Page title & actions */}
				<Heading title="Dashboard">
					<HeadingButtons />
				</Heading>

				{/* Pinned projects */}
				<PinnedProjects projects={pinnedProjects} removePin={removePin} />

				{/* Projects list (only on smallest breakpoint) */}
				<ProjectsList projects={projects} />

				{/* Projects table (small breakpoint and up) */}
				<ProjectsTable
					projects={projects}
					setOpenDeleteModal={setOpenDeleteModal}
					setDeleteProjectId={setDeleteProjectId}
				/>

				{/* Success Notification */}
				<SuccessNotification show={successNotificationOpen} setShow={setSuccessNotificationOpen}>
					{successMessage}
				</SuccessNotification>

				{/* Delete Modal */}
				<DeleteModal
					open={openDeleteModal}
					projectId={deleteProjectId}
					setOpenDeleteModal={setOpenDeleteModal}
					deleteProject={deleteProject}
				/>
			</>
		</AppContainer>
	);
}
