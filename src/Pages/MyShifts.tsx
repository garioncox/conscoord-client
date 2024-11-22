import { PaginatedTable } from "@/Components/paginated-table";
import { usePaginatedTable } from "@/Components/PaginatedTableHook";
import { Spinner } from "@/Components/Spinner";
import { useClaimedShiftsForLoggedInUser } from "@/Functions/Queries/ShiftQueries";
import { Link, useNavigate } from "react-router-dom";
import { Shift } from "@/Data/Interfaces/Shift";
import { CombineTime } from "@/Functions/CombineTime";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { useEmpShiftsForLoggedInUser } from "@/Functions/Queries/EmployeeShiftQueries";

function MyShifts() {
  const { data: shifts } = useClaimedShiftsForLoggedInUser();
  const { data: employeeShifts } = useEmpShiftsForLoggedInUser();
  const navigate = useNavigate();
  const control = usePaginatedTable(shifts ?? []);

  const getNumEmployeesSignedUpForShift = (s: Shift) => {
    return (
      employeeShifts?.filter((es: EmployeeShift) => es.shiftId == s.id)
        .length ?? 0
    );
  };

  const getColor = (s: Shift) => {
    const percentage =
      getNumEmployeesSignedUpForShift(s) / s.requestedEmployees;

    return percentage <= 0.2 ? "red" : percentage <= 0.8 ? "yellow" : "green";
  };

  const shiftNeedsTimeEntered = (shift: Shift) => {
    const empShift = employeeShifts?.filter(
      (es: EmployeeShift) => es.shiftId == shift.id
    )[0];

    const hasEnteredTime = empShift?.clockInTime && empShift?.clockOutTime;
    if (hasEnteredTime) {
      return false;
    }

    return true;
  };

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
    <div className="min-w-full 2xl:px-40">
      <h1 className="text-4xl pb-5">My Shifts</h1>
      <PaginatedTable paginatedTableControl={control}>
        <div>
          <div className="px-3 font-semibold border-b-2 border-slate-200">
            <div className="grid grid-cols-4 gap-10 pb-3">
              <p>Location</p>
              <p>Time</p>
              <p>Description</p>
              <p className="text-end">Shifts Fulfilled</p>
            </div>
          </div>
          {control.currentItems.map((s: Shift) => {
            return (
              <div
                className={`grid grid-cols-4 gap-10 py-5 px-3 hover:bg-slate-200 border-b-2 border-slate-200 relative ${
                  shiftNeedsTimeEntered(s)
                    ? "border-l-8 border-l-yellow-500"
                    : ""
                } hover:cursor-pointer`}
                key={s.id}
                title={`${
                  shiftNeedsTimeEntered(s) ? "Shift needs time entered" : ""
                }`}
                onClick={() => navigate(`/shift/view/details/${s.id}`)}
              >
                <p>{s.location}</p>
                <p>{CombineTime(s.startTime, s.endTime)}</p>
                <p>{s.description}</p>
                <p className={`text-end font-semibold text-${getColor(s)}-500`}>
                  {getNumEmployeesSignedUpForShift(s)}
                  {" / "}
                  {s.requestedEmployees}
                </p>
              </div>
            );
          })}
        </div>
      </PaginatedTable>
    </div>
  );
}

export default MyShifts;
