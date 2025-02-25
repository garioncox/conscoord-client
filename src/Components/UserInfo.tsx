import { TextField } from "@mui/material";
import { Save } from "lucide-react";
import { Spinner } from "./Spinner";
import { EmployeeHistoryDTO } from "@/Data/DTOInterfaces/EmployeeHistoryDTO";
import { useUserInfoControl } from "@/Pages/Control/UserInfoControl";
import GPhoneInput from "./Generics/gPhoneInput";

export const UserInfo = () => {
  const control = useUserInfoControl();

  if (control.isLoading) {
    return <Spinner />;
  }

  return (
    <div className="block lg:flex grow justify-center items-start p-6 md:p-12 gap-6 min-h-screen">
      {/* Employee List */}
      <div className="flex flex-col rounded border-2 border-slate-300 shadow-md shadow-slate-400 mb-10 max-h-96 lg:max-h-[75vh] lg:mb-0 max-w-[800px]">
        <div className="p-2 md:p-4 flex flex-row items-center sticky top-0 bg-slate-200 z-10">
          <TextField
            className="w-full sm:w-3/4"
            label="Filter"
            variant="standard"
            fullWidth
            onChange={(e) =>
              control.setFilterString(e.target.value.toLowerCase())
            }
          />
        </div>

        <div className="flex flex-col grow overflow-y-auto max-h-screen min-w-80">
          {control.Employees?.sort((a, b) => a.id - b.id).map((e) => {
            if (
              String(e.id).includes(control.filterString) ||
              e.name.toLowerCase().includes(control.filterString)
            ) {
              return (
                <div
                  key={e.id}
                  className={`grid grid-cols-1 md:grid-cols-4 gap-y-2 px-3 py-4 border-b ${
                    control.selectedEmployee?.id === e.id
                      ? "shadow-inner shadow-slate-500 bg-slate-200"
                      : "cursor-pointer"
                  }`}
                  onClick={() => {
                    control.HandleSelectEmployee(e);
                    if (control.cardView == "none") {
                      control.setCardView("info");
                    }
                  }}
                >
                  <p className="md:col-span-3 truncate">{e.name}</p>
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* Employee Info / History */}
      <div className="flex flex-col grow max-w-[800px] shadow-md shadow-slate-400 lg:min-h-[75vh] max-h-[75vh]">
        <div className="grid grid-cols-2 text-center">
          <div
            className={`rounded-tl border-2 border-r-0 border-slate-300 p-4 ${
              control.cardView != "info"
                ? "text-slate-500 cursor-pointer bg-slate-200 shadow-inner"
                : "border-b font-semibold text-gray-700 underline"
            }`}
            onClick={() =>
              control.selectedEmployee && control.setCardView("info")
            }
          >
            Employee Info
          </div>
          <div
            className={`rounded-tr border-2 border-slate-300 p-4 ${
              control.cardView != "history"
                ? "text-slate-500 cursor-pointer bg-slate-200 shadow-inner"
                : "border-b font-semibold text-gray-700 underline"
            }`}
            onClick={() =>
              control.selectedEmployee && control.setCardView("history")
            }
          >
            View History
          </div>
        </div>

        <div className="flex flex-col grow lg:p-4 overflow-x-auto border-slate-300 border-2 border-t-0 rounded-b shadow-md shadow-slate-400">
          {/* History View */}
          {control.cardView == "history" && (
            <>
              {control.isEmpHistoryLoading ? (
                <div className="text-center">
                  <Spinner />
                </div>
              ) : control.empHistory?.length ? (
                control.empHistory.map((e: EmployeeHistoryDTO) => (
                  <div
                    key={e.date}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-y-2 p-5 border-b"
                  >
                    <p className="sm:col-span-2">{e.date.slice(0, 10)}</p>
                    <p className="sm:col-span-4">{e.projectName}</p>
                    <p className="sm:col-span-5">{e.location}</p>
                    <p className="sm:col-span-1 text-center">
                      {e.hours.slice(0, 3)} {e.hours == "--" ? "" : " hr"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center">No Data</div>
              )}
            </>
          )}

          {/* Employee Info View */}
          {control.cardView == "info" && (
            <div className="p-4">
              <Save
                className="text-slate-500 hover:text-slate-700 ms-auto me-8 mt-4"
                onClick={() => control.HandleSaveEmployee()}
                size={32}
              />
              <div className="max-w-md mx-auto">
                <div className="my-4">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Name
                  </label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={control.employeeName}
                    onChange={(e) => control.setEmployeeName(e.target.value)}
                    type="text"
                    maxLength={50}
                  />
                </div>

                <div className="my-4">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Email
                  </label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={control.employeeEmail}
                    onChange={(e) => control.setEmployeeEmail(e.target.value)}
                    type="text"
                    maxLength={30}
                  />
                </div>

                <div className="my-4">
                  <GPhoneInput
                    label="Phone Number"
                    control={control.phoneControl}
                  />
                </div>

                <div className="my-4">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Company
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={control.employeeCompanyId || ""}
                    onChange={(e) =>
                      control.setEmployeeComanyId(Number(e.target.value))
                    }
                  >
                    <option value="" disabled>
                      No Company Selected
                    </option>
                    {control.companies?.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="my-4">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Role
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={control.employeeRoleId || ""}
                    onChange={(e) =>
                      control.setEmployeeRoleId(Number(e.target.value))
                    }
                  >
                    <option value="" disabled>
                      No Role Selected
                    </option>
                    {control.roles?.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.rolename}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
