import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import {
  useAllEmployees,
  useEditEmployeeMutation,
} from "@/Functions/Queries/EmployeeQueries";
import { TextField } from "@mui/material";
import { ArrowBigRight, Save } from "lucide-react";
import { useState } from "react";
import { Spinner } from "./Spinner";
import { useEmpShiftHistoryForEmail } from "@/Functions/Queries/EmployeeShiftQueries";
import { EmployeeHistoryDTO } from "@/Data/DTOInterfaces/EmployeeHistoryDTO";

export const UserInfo = () => {
  const editEmployeeMutation = useEditEmployeeMutation();
  const { data: Employees, isLoading: employeesLoading } = useAllEmployees();

  const [Employee, setEmployee] = useState<Employee>();
  const [EmployeeName, setEmployeeName] = useState("");
  const [EmployeeEmail, setEmployeeEmail] = useState("");
  const [EmployeePhoneNumber, setEmployeePhoneNumber] = useState("");
  const [EmployeeRoleId, setEmployeeRoleId] = useState(0);
  const [EmployeeCompanyId, setEmployeeCompanyId] = useState(0);
  const [filterString, setFilterString] = useState("");

  const [selection, setSelection] = useState<"info" | "history" | "none">(
    "none"
  );

  const { data: empHistory, isLoading: isEmpHistoryLoading } =
    useEmpShiftHistoryForEmail(EmployeeEmail);

  function EditEmployee() {
    if (!Employee) return;
    if (!EditedEmployee()) return;

    const employee = {
      id: Employee.id,
      name: EmployeeName,
      email: EmployeeEmail,
      phonenumber: EmployeePhoneNumber,
      roleid: EmployeeRoleId,
      companyid: EmployeeCompanyId,
    };
    editEmployeeMutation.mutate(employee);
  }

  function EditedEmployee() {
    if (!Employee) {
      return false;
    }

    if (
      EmployeeName == Employee.name &&
      EmployeeEmail == Employee.email &&
      EmployeePhoneNumber == Employee.phonenumber &&
      EmployeeRoleId == Employee.roleid &&
      EmployeeCompanyId == Employee.companyid
    ) {
      return false;
    }

    return true;
  }

  const handleEmployeeSelect = (selectedEmployee: Employee | null) => {
    if (selectedEmployee) {
      setEmployee(selectedEmployee);
      setEmployeeName(selectedEmployee.name);
      setEmployeeEmail(selectedEmployee.email);
      setEmployeePhoneNumber(selectedEmployee.phonenumber);
      setEmployeeRoleId(selectedEmployee.roleid);
      setEmployeeCompanyId(selectedEmployee.companyid);
    }
  };

  if (employeesLoading) {
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
            onChange={(e) => setFilterString(e.target.value.toLowerCase())}
          />
        </div>

        <div className="flex flex-col grow pb-4 overflow-x-scroll ">
          {Employees?.sort((a, b) => a.id - b.id).map((e) => {
            if (
              String(e.id).includes(filterString) ||
              e.name.toLowerCase().includes(filterString)
            ) {
              return (
                <div
                  key={e.id}
                  className={`grid grid-cols-4 gap-0 p-5 border-b ${
                    Employee != null && Employee.id == e.id
                      ? "shadow-inner shadow-slate-500 bg-slate-200"
                      : "cursor-pointer"
                  }`}
                  onClick={() => {
                    handleEmployeeSelect(e);
                    if (selection == "none") {
                      setSelection("info");
                    }
                  }}
                >
                  <p className="col-span-1">{e.id}</p>
                  <p className="col-span-3 truncate">{e.name}</p>
                </div>
              );
            }
          })}
        </div>
      </div>

      <div className="flex items-center px-16">
        <ArrowBigRight size={32} />
      </div>

      {/* View History or Edit */}
      <div className="flex flex-col w-full max-w-[800px] shadow-md shadow-slate-400">
        <div className="grid grid-cols-2 text-center">
          <div
            className={`rounded-tl border-2 border-r-0 border-slate-300 p-4 ${
              selection != "info"
                ? "text-slate-500 cursor-pointer bg-slate-200 shadow-inner"
                : "border-b font-semibold text-gray-700 underline"
            }`}
            onClick={() => {
              if (Employee != null) {
                setSelection("info");
              }
            }}
          >
            Employee Info
          </div>
          <div
            className={`rounded-tr border-2 border-slate-300 p-4 ${
              selection != "history"
                ? "text-slate-500 cursor-pointer bg-slate-200 shadow-inner"
                : "border-b font-semibold text-gray-700 underline"
            }`}
            onClick={() => {
              if (Employee != null) {
                setSelection("history");
              }
            }}
          >
            View History
          </div>
        </div>

        <div className="flex flex-col grow p-4 overflow-x-scroll border-slate-300 border-2 border-t-0 rounded-b shadow-md shadow-slate-400">
          {selection == "history" &&
            empHistory &&
            empHistory.map((e: EmployeeHistoryDTO) => {
              if (isEmpHistoryLoading) {
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

          {selection == "info" && (
            <div>
              <Save
                className="text-slate-500 hover:text-slate-700 ms-auto me-8 mt-8"
                onClick={() => EditEmployee()}
                size={32}
              />
              <div className="mx-52">
                {[
                  {
                    label: "Name",
                    value: EmployeeName,
                    setter: setEmployeeName,
                  },
                  {
                    label: "Email",
                    value: EmployeeEmail,
                    setter: setEmployeeEmail,
                  },
                  {
                    label: "Phone Number",
                    value: EmployeePhoneNumber,
                    setter: setEmployeePhoneNumber,
                  },
                  {
                    label: "Role ID",
                    value: EmployeeRoleId,
                    //disable because of e:any
                    //eslint-disable-next-line
                    setter: (e: any) =>
                      setEmployeeRoleId(parseInt(e.target.value)),
                  },
                  {
                    label: "Company ID",
                    value: EmployeeCompanyId,
                    //disable because of e:any
                    //eslint-disable-next-line
                    setter: (e: any) =>
                      setEmployeeCompanyId(parseInt(e.target.value)),
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
