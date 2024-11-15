import { EmployeeProjectTable } from "@/Components/EmployeeProjectTable";
import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { Spinner } from "@/Components/Spinner";
import { Project } from "@/Data/Interfaces/Project";
import { useAllProjects } from "@/Functions/ProjectRequests";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProjectList() {
  const { data } = useAllProjects();
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = React.useState<Project[]>([]);  
  const [archived, setArchived] = React.useState(true);

  const control = usePaginatedTable(archived ? filteredData : data ?? []);

  useEffect(() => {
    setFilteredData(data?.filter((project) => project.status !== "ARCHIVED") || []);
  }, [data]);

  const clickOnAProject = (id: number) => {
    navigate(`/project/shifts/${id}`);
  };

  return (
    <div>
      <h1 id="projects">Project List</h1>
      {data ? (
        <>
          <PaginatedTable paginatedTableControl={control}>
            <EmployeeProjectTable
              data={control.currentItems}
              setRowClicked={clickOnAProject} archived={archived} setArchived={setArchived}>
                
              </EmployeeProjectTable>
          </PaginatedTable>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default ProjectList;
