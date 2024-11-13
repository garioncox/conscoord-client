import { EmployeeProjectTable } from "@/Components/EmployeeProjectTable";
import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { Spinner } from "@/Components/Spinner";
import { Project } from "@/Data/Interfaces/Project";
import { useAllProjectByLoggedInCompany } from "@/Functions/ProjectRequests";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProjectList() {
  const { data } = useAllProjectByLoggedInCompany();
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = React.useState<Project[]>([]);  
  const control = usePaginatedTable(filteredData ?? []);

  useEffect(() => {
    setFilteredData(data?.filter((project) => project.status !== "ARCHIVED") || []);
  }, [data]);

  const clickOnAProject = (id: number) => {
    navigate(`/project/shifts/${id}`);
  };

  return (
    <div>
      <h1 id="projects">Project List</h1>
      {filteredData ? (
        <PaginatedTable paginatedTableControl={control}>
          <EmployeeProjectTable
            data={control.currentItems}
            setRowClicked={clickOnAProject}
          />
        </PaginatedTable>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
export default ProjectList;
