import { useShiftRequests } from "../Functions/ShiftRequests";
import { PaginatedProjectTable } from "@/Components/paginated-table";

function ShiftList() {
 const {shiftsQuery} = useShiftRequests();

  return (
    <div>
      <h1 id="shifts"> Shift List</h1>
      {shiftsQuery.data ?
        <PaginatedProjectTable data={shiftsQuery.data}
          tableHeaders={["Location", "Start Time", "End Time", "Description", "Requested Employees", "Status"]}
          rows={["location", "startTime", "endTime", "description", "requestedEmployees", "status"]} />
        : <div className="animate-spin"></div>}
    </div>
  );
}
export default ShiftList;
