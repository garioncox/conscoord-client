import { PaginatedProjectTable } from "@/Components/paginated-table";
import { useAllProjectByLoggedInCompany } from "@/Functions/ProjectRequests";

function ProjectList() {
  const { data, error, isloading } = useAllProjectByLoggedInCompany();

  return (
    <div>
      <h1 id="projects">Project List</h1>
      {data ? (
        <PaginatedProjectTable
          data={data}
          tableHeaders={[
            "Name",
            "Location",
            "Start Date",
            "End Date",
            "Status",
          ]}
          rows={["name", "location", "startDate", "endDate", "status"]}
        />
      ) : (
        <div className="animate-spin"></div>
      )}
    </div>
  );
}
export default ProjectList;
