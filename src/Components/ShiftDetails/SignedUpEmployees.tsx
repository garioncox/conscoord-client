import { useShiftDetailsControl } from "@/Pages/Control/ShiftDetailsControl";
import PermissionComponentLock from "../Auth/PermissionComponentLock";
import { ADMIN_ROLE, CLIENT_ROLE } from "../Auth/PermissionLock";

export const SignedUpEmployees = ({ id }: { id: number }) => {
  const control = useShiftDetailsControl(id);

  return (
    <>
      <div className="w-1/3 p-4 border rounded-lg shadow">
        <div className="mt-10 mb-5 text-4xl font-bold ">
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
                  control.shiftFromParam!.requestedEmployees -
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
          <PermissionComponentLock roles={[CLIENT_ROLE, ADMIN_ROLE]}>
            <div className="mt-10 flex justify-end">
              <button
                onClick={control.archiveShift}
                disabled={control.shiftFromParam?.status === "ARCHIVED"}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded disabled:opacity-30"
              >
                Cancel Shift
              </button>
            </div>
          </PermissionComponentLock>
        </div>
      </div>
    </>
  );
};
