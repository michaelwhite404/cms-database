import { useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../DeleteModal";
import DashboardDatabase from "../../interfaces/DashboardDatabase";
import classNames from "../../utils/classNames";
import Badge from "../Badge";
import ProjectOptions from "./ProjectOptions";

export default function DashboardTableRow({
	project,
	deleteProject,
}: {
	project: DashboardDatabase;
	deleteProject: (databaseId: string) => Promise<void>;
}) {
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	return (
		<tr key={project._id}>
			<td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
				<div className="flex items-center space-x-3 lg:pl-2">
					<div
						className={classNames(
							/* project.bgColorClass */ "bg-pink-600",
							"flex-shrink-0 w-2.5 h-2.5 rounded-full"
						)}
						aria-hidden="true"
					/>
					<Link to={`/databases/${project.slug}`} className="truncate hover:text-gray-600">
						<span>
							{project.name}
							<Badge role={project.role} />
						</span>
					</Link>
				</div>
			</td>
			<td className="px-6 py-3 text-sm text-gray-500 font-medium">
				<div className="flex items-center space-x-2">
					<div className="flex flex-shrink-0 -space-x-1">
						{/* {project.users.map((user) => (
              <img
                key={member.handle}
                className="max-w-none h-6 w-6 rounded-full ring-2 ring-white"
                src={member.imageUrl}
                alt={member.name}
              />
            ))} */}
					</div>
					{/* {project.totalUsers > project.members.length ? ( */}
					<span className="flex-shrink-0 text-xs leading-5 font-medium">
						+{project.totalUsers}
						{/* +{project.totalMembers - project.members.length} */}
					</span>
					{/* ) : null} */}
				</div>
			</td>
			<td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
				{/* {project.lastUpdated} */}
			</td>
			<td className="pr-6">
				<ProjectOptions projectRole={project.role} setOpenDeleteModal={setOpenDeleteModal} />
				{openDeleteModal && (
					<DeleteModal
						project={project}
						setOpenDeleteModal={setOpenDeleteModal}
						deleteProject={deleteProject}
					/>
				)}
			</td>
		</tr>
	);
}
