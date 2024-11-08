import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { PaginatedTable } from "@/Components/paginated-table";
import { useMyShiftFunctions } from "./MyShiftsFunctions";

function MyShifts() {
  const importVariables = useMyShiftFunctions();
  const { user } = useAuth0();

  useEffect(() => {
    importVariables.populateShifts();
  }, [importVariables, user?.email]);

  const contents =
    importVariables.claimedShifts === undefined ? (
      <div className="spinner-border" role="status" />
    ) : (
      <PaginatedTable
        tableHeaders={["Location", "Start Time", "End Time", ""]}
        rows={["location", "startTime", "endTime"]}
        data={importVariables.claimedShifts}
        setRowClicked={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

  return (
    <div>
      <h1 id="shifts">My Shifts</h1>
      {contents}
    </div>
  );
}

export default MyShifts;
