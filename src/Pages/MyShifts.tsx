import { PaginatedTable } from "@/Components/paginated-table";
import { usePagination } from "@/Components/PaginatedTableHook";
import { useClaimedShiftsForLoggedInUser } from "@/Functions/Queries/ShiftQueries";
import { Link, useNavigate } from "react-router-dom";
import { Shift } from "@/Data/Interfaces/Shift";
import { CombineTime } from "@/Functions/CombineTime";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import {
  useAllEmployeeShifts,
  useEmpShiftsForLoggedInUser,
} from "@/Functions/Queries/EmployeeShiftQueries";
import { Spinner } from "@/Components/Spinner";
import { useAuth } from "react-oidc-context";
import { useState } from "react";

function MyShifts() {
  const { data: shifts } = useClaimedShiftsForLoggedInUser();
  const { data: employeeShifts } = useEmpShiftsForLoggedInUser();
  const { data: allEmployeeShifts } = useAllEmployeeShifts();
  const [showPastShifts, setShowPastShifts] = useState<boolean>(false);
  const navigate = useNavigate();

  const shiftNeedsTimeEntered = (shift: Shift) => {
    const empShift = employeeShifts?.filter(
      (es: EmployeeShift) => es.shiftId == shift.id
    )[0];

    const hasEnteredTime = empShift?.clockInTime && empShift?.clockOutTime;
    const isFutureShift = new Date(shift.endTime) > new Date();
    if (hasEnteredTime || isFutureShift) {
      return false;
    }
    return true;
  };

  //after shiftNeedsTimeEntered or else it wouldn't exist to use yet
  const control = usePagination(
    shifts?.filter(
      (x) =>
        showPastShifts ||
        new Date(x.endTime) >= new Date() ||
        shiftNeedsTimeEntered(x)
    ) ?? []
  );
  const { isLoading: authLoading } = useAuth();

  const getNumEmployeesSignedUpForShift = (s: Shift) => {
    return (
      allEmployeeShifts?.filter((es: EmployeeShift) => es.shiftId == s.id)
        .length ?? 0
    );
  };

  const getEmpShiftCountColor = (s: Shift) => {
    const numSignedUp = getNumEmployeesSignedUpForShift(s);

    const percentageFilled = (numSignedUp / s.requestedEmployees) * 100;
    return percentageFilled <= 20
      ? "text-red-500"
      : percentageFilled <= 80
      ? "text-yellow-600"
      : "text-green-600";
  };

  if (!shifts || authLoading) {
    return <Spinner />;
  }

  if (shifts.length == 0) {
    return (
      <div className="bg-tertiary max-h-[50%] shadow-xl border p-5 md:p-10 my-10 rounded-xl flex flex-col justify-center items-center">
        <p className="font-semibold text-2xl text-center text-slate-600">
          Looks like you haven't signed up for any shifts...
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center mt-20">
          <p className="flex self-center md:text-xl">
            Try signing up for some now.
          </p>
          <Link
            to={"/shift/view/available"}
            className="mt-3 p-3 px-5 md:ms-5 rounded-xl bg-slate-600 text-white max-w-48 self-center"
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
      <div className="flex items-center gap-2 p-3">
        <input
          type="checkbox"
          id="pastShifts"
          className="w-5 h-5 accent-blue-600 cursor-pointer"
          onClick={() => setShowPastShifts(!showPastShifts)}
        />
        <label
          htmlFor="pastShifts"
          className="text-lg font-medium cursor-pointer select-none"
        >
          Show Past Shifts
        </label>
      </div>

      <div className="overflow-y-auto max-h-[80%]">
        <PaginatedTable control={control}>
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
                      ? "border-l-8 border-l-amber-300"
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
                  <p
                    className={`text-end font-semibold ${getEmpShiftCountColor(
                      s
                    )}`}
                  >
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
    </div>
  );
}

export default MyShifts;
