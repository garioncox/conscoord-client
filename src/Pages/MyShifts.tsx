import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { Spinner } from "@/Components/Spinner";
import { EmployeeShiftTable } from "@/Components/EmployeeShiftTable";
import { useClaimedShiftsForLoggedInUser } from "@/Functions/Queries/ShiftQueries";
import { Link } from "react-router-dom";

function MyShifts() {
  const { data: shifts } = useClaimedShiftsForLoggedInUser();

  const control = usePaginatedTable(shifts ?? []);

  if (!shifts) {
    return <Spinner />;
  }

  if (shifts.length == 0) {
    return (
      <div className="bg-tertiary w-2/3 h-1/2 shadow-xl border p-10 my-10 rounded-xl">
        <p className="text-6xl text-center text-slate-600 p-20">
          Looks like you haven't signed up for any shifts...
        </p>
        <div className="flex p-20 content-center align-middle justify-center grow">
          <p className="text-2xl flex self-center">
            Try signing up for some now.
          </p>
          <Link
            to={"/shift/view/available"}
            className="ms-10 border p-3 px-5 rounded-xl bg-slate-600 text-white hover:bg-primary"
          >
            View Available Shifts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-full px-40">
      <h1 className="text-4xl pb-5">My Shifts</h1>{" "}
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
