import { PaginatedTable } from "@/Components/paginated-table";
import { Link } from "react-router-dom";
import { Shift } from "@/Data/Interfaces/Shift";
import { CombineTime } from "@/Functions/CombineTime";
import { Spinner } from "@/Components/Spinner";
import { useMyShiftsControl } from "./Control/MyShiftsControl";

function MyShifts() {
  const control = useMyShiftsControl();

  if (control.isLoading) {
    return <Spinner />;
  }

  if (control.shifts?.length == 0) {
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
      <div className="flex">
        <div className="flex items-center gap-2 p-3">
          <input
            type="checkbox"
            id="pastShifts"
            className="w-5 h-5 accent-blue-600 cursor-pointer"
            onClick={() => control.setShowPastShifts(!control.showPastShifts)}
          />
          <label
            htmlFor="pastShifts"
            className="text-lg font-medium cursor-pointer select-none"
          >
            Show Past Shifts
          </label>
        </div>
        <div className="flex items-center ms-auto text-lg pe-3">
          <div className="flex flex-row items-center ps-6">
            <div className="h-5 w-5 bg-green-500 rounded border border-green-600" />
            <div className="ps-2">Past Shift</div>
          </div>
          <div className="flex flex-row items-center ps-6">
            <div className="h-5 w-5 bg-amber-300 rounded border border-amber-500" />
            <div className="ps-2">Enter Time</div>
          </div>
          <div className="flex flex-row items-center ps-6">
            <div className="h-5 w-5 bg-gray-300 rounded border border-gray-400" />
            <div className="ps-2">Future Shift</div>
          </div>
        </div>
      </div>

      <PaginatedTable control={control.paginationControl}>
        <div>
          <div className="px-3 font-semibold border-b-2 border-slate-200">
            <div className="grid grid-cols-4 gap-10 pb-3">
              <p className="text-xl">Location</p>
              <p className="text-xl">Time</p>
              <p className="text-xl">Description</p>
              <p className="text-xl text-end">Shifts Fulfilled</p>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[400px] xl:h-[50vh] xl:max-h-full">
            {control.paginationControl.currentItems.map((s: Shift) => {
              return (
                <div
                  className={`grid grid-cols-4 gap-10 py-5 px-3 hover:bg-slate-200 border-b-2 border-slate-200 relative border-l-8 ${control.getShiftStatusColor(
                    s
                  )} hover:cursor-pointer`}
                  key={s.id}
                  title={`${
                    control.shiftNeedsTimeEntered(s)
                      ? "Shift needs time entered"
                      : ""
                  }`}
                  onClick={() =>
                    control.navigate(`/shift/view/details/${s.id}`)
                  }
                >
                  <p>{s.location}</p>
                  <p>{CombineTime(s.startTime, s.endTime)}</p>
                  <p>{s.description}</p>
                  <p
                    className={`pe-2 text-end font-semibold ${control.getEmpShiftCountColor(
                      s
                    )}`}
                  >
                    {control.getNumEmployeesSignedUpForShift(s)}
                    {" / "}
                    {s.requestedEmployees}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </PaginatedTable>
    </div>
  );
}

export default MyShifts;
