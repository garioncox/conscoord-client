import { useEffect, useState } from "react";
import { Project } from "../Data/Interfaces/Project";
import { useProjectRequests } from "../Functions/ProjectRequests";
import { useAuth0 } from "@auth0/auth0-react";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { PaginatedProjectTable } from "@/Components/paginated-table";

function ProjectList() {
  const { getCompanyProjects, } =
    useProjectRequests();
  const { getEmployeeByEmail } = useEmployeeRequests();
  const [projects, setProjects] = useState<Project[]>();

  useEffect(() => {
    populateProjects();
  }, []);

  const { user } = useAuth0();

  async function populateProjects() {
    if (user === undefined) {
      return;
    }
    const u = await getEmployeeByEmail(user.email || "");
    const projects = await getCompanyProjects(u.id);
    setProjects(projects);
  }

  return (
    <div>
      <h1 id="projects">Project List</h1>
      {projects ?
        <PaginatedProjectTable data={projects}
          tableHeaders={["Name", "Location", "Start Date", "End Date", "Status"]}
          rows={["name", "location", "startDate", "endDate", "status"]} />
        : <div className="animate-spin"></div>}
    </div>
  );
}
export default ProjectList;