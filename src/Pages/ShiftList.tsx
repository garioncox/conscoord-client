import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { useAllShifts } from "@/Functions/Queries/ShiftQueries";
import { EmployeeShiftTable } from "@/Components/EmployeeShiftTable";
import { Spinner } from "@/Components/Spinner";

function ShiftList() {
  const { data: shifts } = useAllShifts();
  const control = usePaginatedTable(shifts ?? []);

  return (
    <div>
      <h1 id="shifts"> Shift List</h1>
      {shifts ? (
        <PaginatedTable paginatedTableControl={control}>
          <EmployeeShiftTable data={control.currentItems} setRowClicked={() => { }} />
        </PaginatedTable>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
export default ShiftList;
