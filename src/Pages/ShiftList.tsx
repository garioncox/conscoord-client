import { useAllShifts } from "../Functions/ShiftRequests";
import { PaginatedProjectTable } from "@/Components/paginated-table";
import { AddShift } from "@/Components/AddShift";

function ShiftList() {
  const { data } = useAllShifts();

  return (
    <div>
      <h1 id="shifts"> Shift List</h1>
      {data ? (
        <PaginatedProjectTable data={data}
          tableHeaders={["Location", "Start Time", "End Time", "Description", "Requested Employees", "Status"]}
          rows={["location", "startTime", "endTime", "description", "requestedEmployees", "status"]} >
          <AddShift />
        </PaginatedProjectTable>
      ) : (
        <div className="animate-spin"></div>
      )}
    </div>
  );
}
export default ShiftList;
