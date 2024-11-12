import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { useAllShifts } from "@/Functions/Queries/ShiftQueries";
import { EmployeeShiftTable } from "@/Components/EmployeeShiftTable";
import { Spinner } from "@/Components/Spinner";

function ShiftList() {
  const { data } = useAllShifts();
  const control = usePaginatedTable(data ?? []);

  return (
    <div>
      <h1 id="shifts"> Shift List</h1>
      {data ? (
        <PaginatedTable paginatedTableControl={control}>
          <EmployeeShiftTable data={control.currentItems} />
        </PaginatedTable>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
export default ShiftList;
