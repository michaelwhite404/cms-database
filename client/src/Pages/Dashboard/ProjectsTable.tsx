import DashboardTableRow from "./DashboardTableRow";
import DashboardDatabase from "../../interfaces/DashboardDatabase";

interface ProjectsTableProps {
	projects: DashboardDatabase[];
	setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
	setProjectToDelete: React.Dispatch<React.SetStateAction<DashboardDatabase>>;
	togglePin: (databaseId: string) => Promise<void>;
}

export default function ProjectsTable({
	projects,
	setOpenDeleteModal,
	setProjectToDelete,
	togglePin,
}: ProjectsTableProps) {
	return (
		<div className="hidden mt-8 sm:block">
			<div className="align-middle inline-block min-w-full border-b border-gray-200">
				<table className="min-w-full">
					<thead>
						<tr className="border-t border-gray-200">
							<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								<span className="lg:pl-2">Projecttttttttt</span>
							</th>
							<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Members
							</th>
							<th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Last Viewed
							</th>
							<th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-100">
						{projects.map((project) => (
							<DashboardTableRow
								project={project}
								setOpenDeleteModal={setOpenDeleteModal}
								setProjectToDelete={setProjectToDelete}
								togglePin={togglePin}
								key={project._id}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
