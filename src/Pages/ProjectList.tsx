import { AddProject } from "@/Components/AddProject";
import { PaginatedTable } from "@/Components/paginated-table";
import { useAllProjectByLoggedInCompany } from "@/Functions/ProjectRequests";
import React from "react";

function ProjectList() {
  const { data } = useAllProjectByLoggedInCompany();

  const [rowClicked, setRowClicked] = React.useState<number>(0);

  return (
    <div>
      <p>rowClicked: {rowClicked}</p>
      <h1 id="projects">Project List</h1>
      {data ? (
        <PaginatedTable data={data}
          tableHeaders={["Name", "Location", "Start Date", "End Date", "Status"]}
          rows={["name", "location", "startDate", "endDate", "status"]} setRowClicked={setRowClicked} >
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
