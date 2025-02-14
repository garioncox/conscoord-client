import { TextField } from "@mui/material";
import { Save } from "lucide-react";
import { Spinner } from "./Spinner";
import { EmployeeHistoryDTO } from "@/Data/DTOInterfaces/EmployeeHistoryDTO";
import { useUserInfoControl } from "@/Pages/Control/UserInfoControl";

export const UserInfo = () => {
  const control = useUserInfoControl();

  if (control.isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-row grow justify-center align-middle p-12">
      {/* Filter Emp */}
      <div className="flex flex-col w-full max-w-96 rounded border-2 border-slate-300 shadow-md shadow-slate-400">
        <div className="p-4 flex flex-row items-center sticky top-0 bg-slate-200 z-10">
          <TextField
            label="Filter"
            variant="standard"
            fullWidth
            onChange={(e) =>
              control.setFilterString(e.target.value.toLowerCase())
            }
          />
        </div>

        <div className="flex flex-col grow overflow-x-scroll">
          {control.Employees?.sort((a, b) => a.id - b.id).map((e) => {
            if (
              String(e.id).includes(control.filterString) ||
              e.name.toLowerCase().includes(control.filterString)
            ) {
              return (
                <div
                  key={e.id}
                  className={`grid grid-cols-4 gap-0 p-5 border-b ${
                    control.selectedEmployee != null &&
                    control.selectedEmployee.id == e.id
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
                  <p className="col-span-1">{e.id}</p>
                  <p className="col-span-3 truncate">{e.name}</p>
                </div>
              );
            }
          })}
          <div
            key={"add"}
            className={`grid grid-cols-4 gap-0 p-5 border-t-2 border-slate-300 bg-slate-100 ${
              control.isAddingEmployee
                ? "shadow-inner shadow-slate-500 bg-slate-300"
                : "cursor-pointer"
            }`}
            onClick={() => {
              control.HandleSelectEmployee(null);
              control.setIsAddingEmployee(true);
              control.setCardView("info");
            }}
          >
            <p className="col-span-1 font-bold">(+)</p>
            <p className="col-span-3 truncate"> Create New Employee</p>
          </div>
        </div>
      </div>

      <span className="flex items-center px-16" />

      {/* View History or Edit */}
      <div className="flex flex-col w-full max-w-[800px] shadow-md shadow-slate-400">
        <div className="grid grid-cols-2 text-center">
          <div
            className={`rounded-tl border-2 border-r-0 border-slate-300 p-4 ${
              control.cardView != "info"
                ? "text-slate-500 cursor-pointer bg-slate-200 shadow-inner"
                : "border-b font-semibold text-gray-700 underline"
            }`}
            onClick={() => {
              if (control.selectedEmployee != null) {
                control.setCardView("info");
              }
            }}
          >
            Employee Info
          </div>
          <div
            className={`rounded-tr border-2 border-slate-300 p-4 ${
              control.cardView != "history"
                ? "text-slate-500 cursor-pointer bg-slate-200 shadow-inner"
                : "border-b font-semibold text-gray-700 underline"
            }`}
            onClick={() => {
              if (control.selectedEmployee != null) {
                control.setCardView("history");
              }
            }}
          >
            View History
          </div>
        </div>

        <div className="flex flex-col grow p-4 overflow-x-scroll border-slate-300 border-2 border-t-0 rounded-b shadow-md shadow-slate-400">
          {control.cardView == "history" &&
            control.empHistory &&
            control.empHistory.length <= 0 && (
              <div className="text-center">No Data</div>
            )}

          {control.cardView == "history" && control.isEmpHistoryLoading && (
            <div className="text-center">
              <Spinner />
            </div>
          )}

          {control.cardView == "history" &&
            control.empHistory &&
            control.empHistory.map((e: EmployeeHistoryDTO) => {
              if (control.isEmpHistoryLoading) {
                return <Spinner />;
              }

              return (
                <div className="grid grid-cols-12 gap-x-4 p-5 border-b">
                  <p className="col-span-1 truncate">{e.date}</p>
                  <p className="col-span-4 truncate">{e.projectName}</p>
                  <p className="col-span-5 truncate">{e.location}</p>
                  <p className="col-span-1 truncate">{e.hours} hr</p>
                </div>
              );
            })}

          {control.cardView == "info" && (
            <div>
              <Save
                className="text-slate-500 hover:text-slate-700 ms-auto me-8 mt-8"
                onClick={() => control.HandleSaveEmployee()}
                size={32}
              />
              <div className="mx-52">
                {[
                  {
                    label: "Name",
                    value: control.employeeName,
                    setter: control.setEmployeeName,
                  },
                  {
                    label: "Email",
                    value: control.employeeEmail,
                    setter: control.setEmployeeEmail,
                  },
                  {
                    label: "Phone Number",
                    value: control.employeePhoneNumber,
                    setter: control.setEmployeePhoneNumber,
                  },
                ].map((field, index) => (
                  <div key={index} className="my-10">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {field.label}
                    </label>
                    <input
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      value={field.value ?? ""}
                      onChange={(e) => field.setter(e.target.value)}
                      type={field.label.includes("ID") ? "number" : "text"}
                    />
                  </div>
                ))}

                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Company
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={control.employeeCompanyId || ""}
                  onChange={(e) =>
                    control.setEmployeeCompanyId(Number(e.target.value))
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
                <div className="my-10">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Role
                  </label>
                  <select
                    className=" w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
