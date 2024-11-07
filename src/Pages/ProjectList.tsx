import { AddProject } from "@/Components/AddProject";
import { PaginatedTable } from "@/Components/paginated-table";
import { useAllProjectByLoggedInCompany } from "@/Functions/ProjectRequests";
import { useNavigate } from "react-router-dom";

function ProjectList() {
  const { data } = useAllProjectByLoggedInCompany();
  const navigate = useNavigate();

  // const [rowClicked, setRowClicked] = React.useState<number>(0);
  const clickOnAProject = (id: number) => {
    navigate(`/project/shifts/${id}`)
  }


  return (
    <div>
      <h1 id="projects">Project List</h1>
      {data ? (
        <PaginatedTable data={data}
          tableHeaders={["Name", "Location", "Start Date", "End Date", "Status"]}
          rows={["name", "location", "startDate", "endDate", "status"]} setRowClicked={clickOnAProject} >
          <AddProject />
        </PaginatedTable>
      ) : (
        <div className="animate-spin"></div>
      )
      }
    </div >
  );
}
export default ProjectList;
