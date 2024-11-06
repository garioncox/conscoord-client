import { useState, useEffect } from "react";
import { Shift } from "../Data/Interfaces/Shift";
import { useShiftRequests } from "../Functions/ShiftRequests";
import { PaginatedProjectTable } from "@/Components/paginated-table";
import { AddShift } from "@/Components/AddShift";

function ShiftList() {
  const { getAllArchivedShifts, getAllShifts, } =
    useShiftRequests();

  const [shifts, setShifts] = useState<Shift[]>();

  useEffect(() => {
    populateShifts();
  }, []);

  async function populateShifts() {
    const archived = await getAllArchivedShifts();
    const active = await getAllShifts();
    setShifts([...archived, ...active]);
  }

  return (
    <div>
      <h1 id="shifts"> Shift List</h1>
      {shifts ?
            <PaginatedProjectTable data={shifts}
            tableHeaders={["Location", "Start Time", "End Time", "Description", "Requested Employees", "Status"]}
            rows={["location", "startTime", "endTime", "description", "requestedEmployees", "status"]} >
              <AddShift />
            </PaginatedProjectTable> 
        : <div className="animate-spin"></div>}
    </div>
  );
}
export default ShiftList;
