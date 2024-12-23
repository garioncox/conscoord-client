import { EmployeeProjectTable } from "@/Components/Tables/EmployeeProjectTable";
import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { ProjectTable } from "@/Components/Tables/ProjectTable";
import { Spinner } from "@/Components/Spinner";
import { Project } from "@/Data/Interfaces/Project";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ADMIN_ROLE,
  CLIENT_ROLE,
  PSO_ROLE,
} from "@/Components/Auth/PermissionLock";
import PermissionComponentLock from "@/Components/Auth/PermissionComponentLock";
import { Checkbox } from "@mui/material";
import { useRoleQuery } from "@/Functions/RoleProvider";
import ProjectSort from "@/Components/Sorting/ProjectSort";
import {
  useAllProjects,
  useAllProjectByLoggedInCompany,
} from "@/Functions/Queries/ProjectQueries";

function ProjectList() {
  const { data, isLoading } = useAllProjects();
  const roleQuery = useRoleQuery();
  const { data: clientProjects } = useAllProjectByLoggedInCompany();
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = React.useState<Project[]>([]);
  const [archived, setArchived] = React.useState(true);
  const [sortedData, setSortedData] = useState<Project[] | null>([]);
  const control = usePaginatedTable(sortedData || []);

  useEffect(() => {
    if (roleQuery && roleQuery.data === CLIENT_ROLE && clientProjects) {
      const defaultSort = [...clientProjects].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      setSortedData(defaultSort);
    } else if (data) {
      if (archived) {
        const defaultSort = [...filteredData].sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        setSortedData(defaultSort);
      } else {
        const defaultSort = [...data].sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        setSortedData(defaultSort);
      }
    }
  }, [data, filteredData, archived, clientProjects]);

  useEffect(() => {
    setFilteredData(
      data?.filter((project) => project.status !== "ARCHIVED") || []
    );
  }, [data]);

  if (isLoading) {
    return <Spinner />;
  }

  const clickOnAProject = (id: number) => {
    navigate(`/project/shifts/${id}`);
  };

  return (
    <div className="min-w-full 2xl:px-40">
      <h1 className="text-4xl pb-5">Project List</h1>
      <>
        <div className="overflow-y-auto max-h-[80%]">
          <PaginatedTable paginatedTableControl={control}>
            <ProjectSort data={sortedData!} onSortChange={setSortedData} />

            <div className="flex grow justify-end">
              <label>
                Show Archived Projects{" "}
                <Checkbox
                  checked={!archived}
                  onChange={() => {
                    setArchived(!archived);
                    control.setCurrentPage(1);
                  }}
                  className="w-5 h-5 border-2 border-gray-400 rounded-sm checked:border-transparent cursor-pointer ms-5"
                />
              </label>
            </div>
            <PermissionComponentLock roles={[PSO_ROLE]}>
              <EmployeeProjectTable
                data={control.currentItems}
                setRowClicked={clickOnAProject}
              />
            </PermissionComponentLock>

            <PermissionComponentLock roles={[CLIENT_ROLE, ADMIN_ROLE]}>
              <ProjectTable
                data={control.currentItems}
                setRowClicked={clickOnAProject}
              />
            </PermissionComponentLock>
          </PaginatedTable>
        </div>
      </>
    </div>
  );
}

export default ProjectList;
