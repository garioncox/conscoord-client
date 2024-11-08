import { PaginatedTable } from "@/Components/paginated-table";
import { ProjectTable } from "@/Components/ProjectTable";
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
        <PaginatedTable datalength={data.length} data={data} setRowClicked={clickOnAProject} >
          <ProjectTable
            data={data}
            setRowClicked={clickOnAProject}
          />
        </PaginatedTable>
      ) : (
        <div className="animate-spin"></div>
      )
      }
    </div >
  );
}
export default ProjectList;
