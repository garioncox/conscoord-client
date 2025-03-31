import { useParams } from "react-router-dom";
import { Spinner } from "@/Components/Spinner";
import PSOView from "./ShiftDetails/PSOView";
import { useShiftDetailsControl } from "./Control/ShiftDetailsControl";

export const ShiftDetails = () => {
  const { id } = useParams();
  const control = useShiftDetailsControl(Number(id));

  if (control.isLoading || !control.shiftFromParam) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="border space-y-2 border-gray-300 rounded-lg p-6 max-w-md mx-auto shadow-md bg-white">
        <p className="text-xl font-semibold mb-4">Shift Details</p>
        <p>{control.shiftFromParam.location}</p>
        <p>{control.shiftFromParam.startTime}</p>
        <p>{control.shiftFromParam.endTime}</p>
        <p>{control.shiftFromParam.description}</p>
        <p
          className={`font-semibold ${control.shiftFractionStyles(
            control.shiftFromParam
          )}`}
        >
          {control.shiftFractionString(control.shiftFromParam)} Shifts Filled
        </p>
      </div>

      {control.loggedInEmployee?.roleid !== 3 ? (
        <PSOView
          currentEmpShift={control.currentEmpShift}
          startTime={control.loggedStartTime}
          endTime={control.loggedEndTime}
          isFormDisabled={control.isFormDisabled}
          setStartTime={control.setLoggedStartTime}
          setEndTime={control.setLoggedEndTime}
        />
      ) : (
        <div>
          <div className="mt-10 mb-5 text-4xl font-bold">
            Signed Up Employees:
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-slate-300">
              <thead className="bg-slate-200">
                <tr>
                  <th className="border border-slate-300 px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="border border-slate-300 px-4 py-2 text-left">
                    Email
                  </th>
                  <th className="border border-slate-300 px-4 py-2 text-left">
                    Phone Number
                  </th>
                </tr>
              </thead>
              <tbody>
                {control.signedUpEmployees?.map((s, index) => (
                  <tr key={index} className="bg-white even:bg-slate-100">
                    <td className="border border-slate-300 px-4 py-2">
                      {s.name}
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      {s.email}
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      {s.phonenumber}
                    </td>
                  </tr>
                ))}
                {Array.from({
                  length:
                    control.shiftFromParam.requestedEmployees -
                    (control.signedUpEmployees?.length ?? 0),
                }).map((_, index) => {
                  return (
                    <tr
                      key={`empty-${index}`}
                      className="bg-white even:bg-slate-100"
                    >
                      <td className="border border-slate-300 px-4 py-2">
                        &nbsp;
                      </td>
                      <td className="border border-slate-300 px-4 py-2">
                        &nbsp;
                      </td>
                      <td className="border border-slate-300 px-4 py-2">
                        &nbsp;
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-10 flex justify-end">
              <button
                onClick={control.archiveShift}
                disabled={control.shiftFromParam?.status === "ARCHIVED"}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded disabled:opacity-30"
              >
                Cancel Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
