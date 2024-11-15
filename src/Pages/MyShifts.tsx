import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { Spinner } from "@/Components/Spinner";
import { EmployeeShiftTable } from "@/Components/EmployeeShiftTable";
import { useClaimedShiftsForLoggedInUser } from "@/Functions/Queries/ShiftQueries";

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
