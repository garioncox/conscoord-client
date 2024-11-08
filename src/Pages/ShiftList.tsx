import { useAllShifts } from "../Functions/ShiftRequests";
import { PaginatedTable } from "@/Components/paginated-table";
import { AddShift } from "@/Components/AddShift";
import React from "react";

function ShiftList() {
  const { data } = useAllShifts();

  const [rowClicked, setRowClicked] = React.useState<number>(0);

  return (
    <div>
      <p>rowClicked: {rowClicked}</p>
      <h1 id="shifts"> Shift List</h1>
      {data ? (
        <PaginatedTable
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
          setRowClicked={setRowClicked}
        >
          <AddShift />
        </PaginatedTable>
      ) : (
        <div className="animate-spin"></div>
      )}
    </div>
  );
}
export default ShiftList;
