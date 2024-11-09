import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { PaginatedTable } from "@/Components/paginated-table";
import { useMyShiftFunctions } from "./MyShiftsFunctions";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { ShiftTable } from "@/Components/ShiftTable";

function MyShifts() {
  const importVariables = useMyShiftFunctions();
  const { user } = useAuth0();

  const control = usePaginatedTable(importVariables.claimedShifts ?? []);

  useEffect(() => {
    importVariables.populateShifts();
  }, [importVariables, user?.email]);

  const contents =
    importVariables.claimedShifts === undefined ? (
      <div className="spinner-border" role="status" />
    ) : (
      <PaginatedTable paginatedTableControl={control}>
        <ShiftTable data={control.currentItems} setRowClicked={function (id: number): void {
            throw new Error("Function not implemented.");
          } } />
      </PaginatedTable>

    );

  return (
    <div>
      <h1 id="shifts">My Shifts</h1>
      {contents}
    </div>
  );
}

export default MyShifts;
