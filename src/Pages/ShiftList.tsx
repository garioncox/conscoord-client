import { useAllShifts } from "../Functions/ShiftRequests";
import { PaginatedTable } from "@/Components/paginated-table";
import React from "react";
import { ShiftTable } from "@/Components/ShiftTable";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { AddShift } from "@/Components/AddShift";
import { PaginatedTable } from "@/Components/paginated-table";
import React from "react";
import { useAllShifts } from "@/Functions/Queries/ShiftQueries";


function ShiftList() {
  const { data } = useAllShifts();

  const control = usePaginatedTable(data ?? []);
  const [rowClicked, setRowClicked] = React.useState<number>(0);

  return (
    <div>
      <p>rowClicked: {rowClicked}</p>
      <h1 id="shifts"> Shift List</h1>
      {data ? (
        <PaginatedTable paginatedTableControl={control}>
          <ShiftTable
            data={control.currentItems}
            setRowClicked={setRowClicked}
          />

        </PaginatedTable>
      ) : (
        <div className="animate-spin"></div>
      )}
    </div>
  );
}
export default ShiftList;
