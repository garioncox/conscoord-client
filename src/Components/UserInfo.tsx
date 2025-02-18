import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import {
  useAllEmployees,
  useEditEmployeeMutation,
} from "@/Functions/Queries/EmployeeQueries";
import { TextField } from "@mui/material";
import { Save } from "lucide-react";
import { useRef, useState } from "react";
import { Spinner } from "./Spinner";
import { useAllRoles } from "@/Functions/Queries/RoleQueries";
import { useAddCompanyMutation, useAllCompanies } from "@/Functions/Queries/CompanyQueries";
import { EmployeeHistoryDTO } from "@/Data/DTOInterfaces/EmployeeHistoryDTO";
import { useEmpShiftHistoryForEmail } from "@/Functions/Queries/EmployeeShiftQueries";

export const UserInfo = () => {
  const editEmployeeMutation = useEditEmployeeMutation();
  const { data: Employees, isLoading: employeesLoading } = useAllEmployees();
  const { data: roles, isLoading: rolesLoading } = useAllRoles();
  const { data: companies, isLoading: companiesLoading } = useAllCompanies();
  const [Employee, setEmployee] = useState<Employee>();
  const [EmployeeName, setEmployeeName] = useState("");
  const [EmployeeEmail, setEmployeeEmail] = useState("");
  const [EmployeePhoneNumber, setEmployeePhoneNumber] = useState("");
  const [EmployeeRoleId, setEmployeeRoleId] = useState(0);
  const [filterString, setFilterString] = useState("");
  const [CompanyName, setCompanyName] = useState("");
  const EmployeeCompanyId = useRef<number>(0);

  const addCompanyMutation = useAddCompanyMutation();

  const [selection, setSelection] = useState<"info" | "history" | "none">(
    "none"
  );

  const { data: empHistory, isLoading: isEmpHistoryLoading } =
    useEmpShiftHistoryForEmail(EmployeeEmail);

  async function EditEmployee() {
    if (!Employee) return;
    await AddCompany();
    if (!EditedEmployee()) return;
    const employee = {
      id: Employee.id,
      name: EmployeeName,
      email: EmployeeEmail,
      phonenumber: EmployeePhoneNumber,
      roleid: EmployeeRoleId,
      companyid: EmployeeCompanyId.current,
    };
    editEmployeeMutation.mutate(employee);
  }

  async function AddCompany() {
    if (!CompanyName) return;
    const companyId = await addCompanyMutation.mutateAsync({ companyName: CompanyName });
    EmployeeCompanyId.current = companyId
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
      EmployeeCompanyId.current == Employee.companyid
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
      EmployeeCompanyId.current = selectedEmployee.companyid;
    }
  };

  if (employeesLoading || rolesLoading || companiesLoading) {
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

        <div className="flex flex-col grow pb-4 overflow-x-scroll">
          {Employees?.sort((a, b) => a.id - b.id).map((e) => {
            if (
              String(e.id).includes(filterString) ||
              e.name.toLowerCase().includes(filterString)
            ) {
              return (
                <div
                  key={e.id}
                  className={`grid grid-cols-4 gap-0 p-5 border-b ${Employee != null && Employee.id == e.id
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

      {/* View History or Edit */}
      <div className="flex flex-col w-full max-w-[800px] shadow-md shadow-slate-400">
        <div className="grid grid-cols-2 text-center">
          <div
            className={`rounded-tl border-2 border-r-0 border-slate-300 p-4 ${selection != "info"
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
            className={`rounded-tr border-2 border-slate-300 p-4 ${selection != "history"
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
                  value={EmployeeCompanyId.current || ""}
                  onChange={(e) => EmployeeCompanyId.current = Number(e.target.value)}
                >
                  <option value="" disabled>
                    No Company Selected
                  </option>
                  {companies?.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Add New Company (if not listed above)
                  </label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={CompanyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    type="text"
                  />
                <div className="my-10">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Role
                  </label>
                  <select
                    className=" w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={EmployeeRoleId || ""}
                    onChange={(e) => setEmployeeRoleId(Number(e.target.value))}
                  >
                    <option value="" disabled>
                      No Role Selected
                    </option>
                    {roles?.map((role) => (
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
