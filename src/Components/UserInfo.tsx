import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import {
  useAllEmployees,
  useEditEmployeeMutation,
} from "@/Functions/Queries/EmployeeQueries";
import { useAllEmployeeShifts } from "@/Functions/Queries/EmployeeShiftQueries";
import { useAllShifts } from "@/Functions/Queries/ShiftQueries";
import { Autocomplete, TextField } from "@mui/material";
import { ArrowBigRight, Edit } from "lucide-react";
import { useState } from "react";

export const UserInfo = () => {
  const editEmployeeMutation = useEditEmployeeMutation();
  const { data: Employees, isLoading: employeesLoading } = useAllEmployees();
  const { data: empShifts, isLoading: isEmpShiftsLoading } =
    useAllEmployeeShifts();
  const { data: shifts, isLoading: isShiftsLoading } = useAllShifts();

  const [Employee, setEmployee] = useState<Employee>();
  const [Editing, setEditing] = useState(false);
  const [EmployeeName, setEmployeeName] = useState("");
  const [EmployeeEmail, setEmployeeEmail] = useState("");
  const [EmployeePhoneNumber, setEmployeePhoneNumber] = useState("");
  const [EmployeeRoleId, setEmployeeRoleId] = useState(0);
  const [EmployeeCompanyId, setEmployeeCompanyId] = useState(0);
  const [EmployeeView, setEmployeeView] = useState(false);

  function EditEmployee() {
    if (Employee === undefined) return;
    const employee = {
      id: Employee.id,
      name: EmployeeName,
      email: EmployeeEmail,
      phonenumber: EmployeePhoneNumber,
      roleid: EmployeeRoleId,
      companyid: EmployeeCompanyId,
    };
    editEmployeeMutation.mutate(employee);
    setEditing(false);
    setEmployeeName(Employee.name);
    setEmployeeEmail(Employee.email);
    setEmployeePhoneNumber(Employee.phonenumber);
    setEmployeeRoleId(Employee.roleid);
    setEmployeeCompanyId(Employee.companyid);
  }

  const handleEmployeeSelect = (selectedEmployee: Employee | null) => {
    if (selectedEmployee) {
      setEmployee(selectedEmployee);
      setEmployeeView(true);
      // Directly set the form state based on the selected employee
      setEmployeeName(selectedEmployee.name);
      setEmployeeEmail(selectedEmployee.email);
      setEmployeePhoneNumber(selectedEmployee.phonenumber);
      setEmployeeRoleId(selectedEmployee.roleid);
      setEmployeeCompanyId(selectedEmployee.companyid);
    }
  };

  if (employeesLoading) {
    return <div>Loading Users</div>;
  }

  const list = (
    <div>
      <Autocomplete
        disablePortal
        options={Employees!}
        getOptionLabel={(option) => option.name || String(option.id)}
        sx={{ width: 300 }}
        value={Employee}
        onChange={(_, selectedEmployee) =>
          handleEmployeeSelect(selectedEmployee)
        }
        renderInput={(params) => <TextField {...params} label="Employees" />}
        renderOption={(props, option) => (
          <li
            {...props}
            onClick={() => {
              setEmployee(option);
              setEmployeeView(true);
            }}
          >
            {option.id}: {option.name}
          </li>
        )}
      />
    </div>
  );

  const content =
    Employee !== undefined && EmployeeView ? (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          {/* Editable Form Section */}
          <div className="space-y-4">
            {Editing ? (
              // Dynamic input fields (avoiding repetition)
              [
                { label: "Name", value: EmployeeName, setter: setEmployeeName },
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
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {field.label}
                  </label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    type={field.label.includes("ID") ? "number" : "text"}
                  />
                </div>
              ))
            ) : (
              // Non-editable view of employee info
              <>
                <p>{Employee.name}</p>
                <p>{Employee.email}</p>
                <p>{Employee.phonenumber}</p>
                <p>
                  <strong>Role ID:</strong> {Employee.roleid}
                </p>
                <p>
                  <strong>Company ID:</strong> {Employee.companyid}
                </p>
              </>
            )}
          </div>

          {/* Buttons Section */}
          <div className="flex justify-between items-center mt-6">
            {/* Edit Button */}
            {!Editing && (
              <button
                className="flex items-center text-blue-500 hover:text-blue-700"
                onClick={() => {
                  setEditing(true);
                  setEmployeeName(Employee.name);
                  setEmployeeEmail(Employee.email);
                  setEmployeePhoneNumber(Employee.phonenumber);
                  setEmployeeRoleId(Employee.roleid);
                  setEmployeeCompanyId(Employee.companyid);
                }}
              >
                <Edit className="mr-2" />
                Edit{" "}
              </button>
            )}

            {/* Back & Save Buttons */}
            <div className="flex gap-4">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 ml-5 rounded-md"
                onClick={() => {
                  setEmployeeView(false);
                  setEditing(false);
                }}
              >
                Back
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md"
                onClick={() => {
                  EditEmployee();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <div className="flex flex-row grow justify-center align-middle p-12">
      {/* Filter Emp */}
      <div className="flex flex-col w-full max-w-96 rounded border-2">
        <div className="p-4 flex flex-row items-center sticky top-0 bg-slate-200 z-10">
          <TextField label="Filter" variant="standard" fullWidth />
        </div>

        <div className="flex flex-col grow p-4 overflow-x-scroll">
          {Employees?.sort((a, b) => a.id - b.id).map((e) => {
            return (
              <div className="grid grid-cols-4 gap-0 p-5 border-b">
                <p className="col-span-1">{e.id}</p>
                <p className="col-span-3 truncate">{e.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center px-8">
        <ArrowBigRight size={32} />
      </div>

      {/* View History or Edit */}
      <div className="flex flex-col w-full max-w-[500px]">
        <div className="p-4 bg-slate-300 font-semibold text-xl rounded-t">
          ADMIN
        </div>

        <div className="flex flex-col grow p-4 overflow-x-scroll border-slate-300 border-x-2">
          {empShifts?.map((e) => {
            const shift = shifts?.filter((s) => s.id == e.shiftId)[0];
            return (
              <div className="grid grid-cols-4 gap-0 p-5 border-b">
                <p className="col-span-3">{shift!.location}</p>
                <p className="col-span-1 truncate">8.5 hr</p>
              </div>
            );
          })}
          {/* TODO: Duplicate to show scroll- remove  */}
          {empShifts?.map((e) => {
            const shift = shifts?.filter((s) => s.id == e.shiftId)[0];
            return (
              <div className="grid grid-cols-4 gap-0 p-5 border-b">
                <p className="col-span-3">{shift!.location}</p>
                <p className="col-span-1 truncate">8.5 hr</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 text-center">
          <div className="rounded-bl rounded-tr border-2 bg-slate-100 border-r-0 border-t-0 border-slate-300 p-2">
            View History
          </div>
          <div className="rounded-br rounded-tl border-2 bg-slate-200 border-slate-300 p-2 text-gray-400 hover:cursor-pointer">
            Edit Employee
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex">{list}</div>
      <div className="flex">{content}</div>
    </div>
  );
};
