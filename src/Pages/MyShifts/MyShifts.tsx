import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { ShiftTable } from "@/Components/ShiftTable";
import { useAllShiftsForLoggedInUser } from "@/Functions/Queries/ShiftQueries";

function MyShifts() {
  const { data: shifts } = useAllShiftsForLoggedInUser();

  const control = usePaginatedTable(shifts ?? []);

  if (!shifts) {
    return <div className="spinner-border" role="status" />;
  }

  return (
    <div>
      <PaginatedTable paginatedTableControl={control}>
        <ShiftTable
          data={control.currentItems}
          setRowClicked={function (): void {}}
        />
      </PaginatedTable>
    </div>
  );
}

export default MyShifts;
