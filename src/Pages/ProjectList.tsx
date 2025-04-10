import { usePagination } from "@/Components/PaginatedTableHook";
import { ProjectCards } from "@/Components/Tables/ProjectTable";
import { useNavigate } from "react-router-dom";
import { Checkbox, FormControl, MenuItem, Select } from "@mui/material";
import { useProjectSort } from "@/Components/Sorting/ProjectSort";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useProjectListControl } from "@/Pages/Control/ProjectListControl";
import { useAuth } from "react-oidc-context";
import { Spinner } from "@/Components/Spinner";

function ProjectList() {
  const navigate = useNavigate();
  const { isLoading: authLoading } = useAuth();

  const control = useProjectListControl();
  const paginationControl = usePagination(control.sortedData || []);
  const sortControl = useProjectSort(
    control.sortedData ?? [],
    control.setSortedData
  );

  if (control.isLoading || authLoading) {
    return <Spinner />;
  }

  const clickOnAProject = (id: number) => {
    navigate(`/project/shifts/${id}`);
  };

  return (
    <div className="w-full">
      {/* <div className="mb-5 flex flex-row items-center text-xs"> */}
      <div className="mb-5 flex flex-col md:flex-row items-center text-xs w-full">
        <div className="flex flex-row items-center justify-center w-full md:w-auto">
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
              <MenuItem value="Name">Name</MenuItem>
              <MenuItem value="Location">Location</MenuItem>
              <MenuItem value="startDateAsc">Soonest First</MenuItem>
              <MenuItem value="startDateDesc">Latest First</MenuItem>
              <MenuItem value="endDateAsc">Soonest End Date First</MenuItem>
              <MenuItem value="endDateDesc">Latest End Date First</MenuItem>
            </Select>
          </FormControl>

          <div className="h-[1px] w-8 bg-gray-300 mx-3 md:block grow md:w-8" />

          <div className="pe-2 flex items-center">
            <div className="me-2">Archived</div>
            <Checkbox
              checked={control.archivedSelected}
              onChange={() => {
                control.setIsArchivedSelected(!control.archivedSelected);
                paginationControl.setCurrentPage(1);
              }}
              className="ms-1 h-3 w-3"
            />
          </div>

          <div className="h-[1px] w-8 me-2 bg-gray-300 hidden md:block" />

          <div className="pe-2 flex items-center">
            <div className="me-2">Complete</div>
            <Checkbox
              checked={control.completedSelected}
              onChange={() => {
                control.setIsCompletedSelected(!control.completedSelected);
                paginationControl.setCurrentPage(1);
              }}
              className="ms-1 h-3 w-3"
            />
          </div>
        </div>

        <div className="h-[0px] md:h-[1px] flex grow bg-gray-300 me-2 w-full md:w-auto my-2" />

        <div className="flex flex-row items-center justify-center w-full md:w-auto">
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
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>

          <div className="h-[1px] bg-gray-300 md:block grow md:w-8" />

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
      </div>

      <ProjectCards
        data={paginationControl.currentItems}
        setRowClicked={clickOnAProject}
      />
    </div>
  );
}

export default ProjectList;
