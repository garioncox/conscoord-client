import { usePagination } from "@/Components/PaginatedTableHook";
import { ProjectTable } from "@/Components/Tables/ProjectTable";
import { Spinner } from "@/Components/Spinner";
import { Project } from "@/Data/Interfaces/Project";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROLE } from "@/Components/Auth/PermissionLock";
import { Checkbox, FormControl, MenuItem, Select } from "@mui/material";
import { useRoleQuery } from "@/Functions/RoleProvider";
import { useProjectSort } from "@/Components/Sorting/ProjectSort";
import {
  useAllProjects,
  useAllProjectByLoggedInCompany,
} from "@/Functions/Queries/ProjectQueries";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";

function ProjectList() {
  const { data, isLoading } = useAllProjects();
  const { data: clientProjects } = useAllProjectByLoggedInCompany();

  const roleQuery = useRoleQuery();
  const navigate = useNavigate();

  const [filteredData, setFilteredData] = React.useState<Project[]>([]);
  const [archived, setArchived] = React.useState(true);
  const [sortedData, setSortedData] = useState<Project[] | null>([]);

  const paginationControl = usePagination(sortedData || []);
  const sortControl = useProjectSort(sortedData ?? [], setSortedData);

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
    <div>
      <div className="mb-5 flex flex-row items-center text-xs">
        <div className="pe-2">Order By</div>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <Select
            value={sortControl.sortValue}
            displayEmpty
            onChange={(e) => {
              sortControl.handleSortChange(e.target.value);
              sortControl.setSortValue(e.target.value);
            }}
            sx={{
              "& .MuiSelect-select": {
                padding: "4px 8px",
                fontSize: "0.75rem",
              },
            }}
          >
            <MenuItem value="">Select an option</MenuItem>
            <MenuItem value="Name">Name</MenuItem>
            <MenuItem value="Location">Location</MenuItem>
            <MenuItem value="startDateAsc">Soonest First</MenuItem>
            <MenuItem value="startDateDesc">Latest First</MenuItem>
            <MenuItem value="endDateAsc">Soonest End Date First</MenuItem>
            <MenuItem value="endDateDesc">Latest End Date First</MenuItem>
          </Select>
        </FormControl>
        <div className="h-[1px] w-8 bg-gray-300 hidden md:block mx-3"></div>
        <div className="pe-2 flex items-center">
          <div className="me-2">Archived</div>
          <Checkbox
            checked={!archived}
            onChange={() => {
              setArchived(!archived);
              paginationControl.setCurrentPage(1);
            }}
            className="ms-1 h-3 w-3"
          />
        </div>
        <div className="h-[1px] bg-gray-300 flex-grow hidden md:block mx-3"></div>{" "}
        <div>Items per page</div>
        <FormControl sx={{ mx: 1, minWidth: 55 }} size="small">
          <Select
            value={paginationControl.itemsPerPage}
            onChange={(e) =>
              paginationControl.setItemsPerPage(Number(e.target.value))
            }
            autoWidth
            displayEmpty
            sx={{
              "& .MuiSelect-select": {
                padding: "4px 8px",
                fontSize: "0.75rem",
              },
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
        <div className="h-[1px] w-8 bg-gray-300 hidden md:block" />
        <div className="flex items-center space-x-2 ms-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              paginationControl.handlePageChange(
                paginationControl.currentPage - 1
              )
            }
            disabled={paginationControl.currentPage === 1}
            className="w-[33px] h-[33px] text-primary border border-slate-300 hover:border-black"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {paginationControl.currentPage} of{" "}
            {paginationControl.totalPages}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              paginationControl.handlePageChange(
                paginationControl.currentPage + 1
              )
            }
            disabled={
              paginationControl.currentPage === paginationControl.totalPages
            }
            className="w-[33px] h-[33px] text-primary border border-slate-300 hover:border-black"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* TODO: Rename this. It's not a table anymore */}
      <ProjectTable
        data={paginationControl.currentItems}
        setRowClicked={clickOnAProject}
      />
    </div>
  );
}

export default ProjectList;
