import { PaginatedTable } from "@/Components/paginated-table";
import { useAllShiftsForLoggedInUser } from "@/Functions/Queries/ShiftQueries";

function MyShifts() {
  const shifts = useAllShiftsForLoggedInUser();

  if (shifts) {
    return <div className="spinner-border" role="status" />;
  }

  return (
    <PaginatedTable
      tableHeaders={["Location", "Start Time", "End Time", ""]}
      rows={["location", "startTime", "endTime"]}
      data={shifts}
      setRowClicked={function (): void {}}
    />
  );
}

export default MyShifts;
