import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { Spinner } from "@/Components/Spinner";
import { useAllShiftsForLoggedInUser } from "@/Functions/Queries/ShiftQueries";
import { EmployeeShiftTable } from "@/Components/EmployeeShiftTable";

function MyShifts() {
  const { data: shifts } = useClaimedShiftsForLoggedInUser();

  const control = usePaginatedTable(shifts ?? []);

  if (!shifts) {
    return <Spinner />;
  }

  return (
    <div>
      <PaginatedTable paginatedTableControl={control}>
        <EmployeeShiftTable
          data={control.currentItems}
          setRowClicked={function (): void {}}
        />
      </PaginatedTable>
    </div>
  );
}

export default MyShifts;
