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
    setFilteredData(
      data?.filter((project) => project.status !== "ARCHIVED") || []
    );
  }, [data]);

  const clickOnAProject = (id: number) => {
    navigate(`/project/shifts/${id}`);
  };

  return (
    <div className="min-w-full px-40">
      <h1 className="text-4xl pb-5">Project List</h1>
      {data ? (
        <>
          <PaginatedTable paginatedTableControl={control}>
            <div className="flex grow justify-end">
              <label>
                Show Archived Projects
                <input
                  checked={!archived}
                  onChange={() => {
                    setArchived(!archived);
                    control.setCurrentPage(1);
                  }}
                  type="checkbox"
                  className="w-5 h-5 border-2 border-gray-400 rounded-sm checked:border-transparent cursor-pointer ms-5"
                />
              </label>
            </div>
            <EmployeeProjectTable
              data={control.currentItems}
              setRowClicked={clickOnAProject}
            ></EmployeeProjectTable>
          </PaginatedTable>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default ProjectList;
