import { useAllShifts } from "../Functions/ShiftRequests";
import { PaginatedProjectTable } from "@/Components/paginated-table";

function ShiftList() {
  const { data } = useAllShifts();

  return (
    <div>
      <h1 id="shifts"> Shift List</h1>
      {data ? (
        <PaginatedProjectTable
          data={data}
          tableHeaders={[
            "Location",
            "Start Time",
            "End Time",
            "Description",
            "Requested Employees",
            "Status",
          ]}
          rows={[
            "location",
            "startTime",
            "endTime",
            "description",
            "requestedEmployees",
            "status",
          ]}
        />
      ) : (
        <div className="animate-spin"></div>
      )}
    </div>
  );
}
export default ShiftList;
