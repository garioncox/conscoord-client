import { PaginatedTable } from "@/Components/paginated-table";
import { useAllShiftsForLoggedInUser } from "@/Functions/Queries/ShiftQueries";

function MyShifts() {
  const { data: shifts } = useAllShiftsForLoggedInUser();

  if (!shifts) {
    return <div className="spinner-border" role="status" />;
  }

  return (
    <div>
      <PaginatedTable
        tableHeaders={["Location", "Start Time", "End Time", ""]}
        rows={["location", "startTime", "endTime"]}
        data={shifts}
        setRowClicked={function (): void {}}
      />
    </div>
  );
}

export default MyShifts;
