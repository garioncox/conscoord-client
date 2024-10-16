import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "../Data/Interfaces/EmployeeInterface";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { useRoleRequests } from "../Functions/RoleRequests";
import AddOfficer from "./AddOfficer";
import "../index.css";
import PermissionLock, { ADMIN_ROLE } from "../Components/PermissionLock";

export const EmployeeList = () => {
  const { employees, setEmployeesList, getEmployeeById, editEmployee } =
    useEmployeeRequests();
  const { roles, setRolesList } = useRoleRequests();
  const [selectedRole, setSelectedRole] = useState<number | undefined>(-1);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(-1);

  useEffect(() => {
    setEmployeesList();
    setRolesList();
  }, []);

  const navigate = useNavigate();

  const updateUserRole = (employeeId: number, currentRoleId: number) => {
    setSelectedEmployee(employeeId);
    setSelectedRole(currentRoleId);
  };

  const saveUserRole = async (id: number) => {
    const employee = await getEmployeeById(id);

    if (employee) {
      const updatedEmployee: Employee = {
        ...employee,
        roleid: selectedRole ? selectedRole : 0,
      };

      await editEmployee(updatedEmployee);
      await setEmployeesList();
      console.log("Employee updated successfully");
    } else {
      console.log("no role selected");
    }

    setSelectedEmployee(null);
    setSelectedRole(undefined);
  };

  const contents =
    employees === undefined ? (
      <div className="spinner-border" role="status" />
    ) : (
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-start">Name</th>
            <th className="text-start">Phone Number</th>
            <th className="text-start">Email</th>
            <th className="text-start">Role</th>
            <th className="text-start">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id} className="grow grow:hover">
              <td className="text-start">{e.name}</td>
              <td className="text-start">{e.phonenumber}</td>
              <td className="text-start">{e.email}</td>

              {selectedEmployee === e.id ? (
                <>
                  <td className="text-start">
                    <select
                      className="form-select"
                      name="selectRole"
                      onChange={(e) => {
                        setSelectedRole(Number(e.target.value));
                      }}
                    >
                      <option value="" disabled>Default (No Role)</option>
                      {roles.map((role) => (
                        <option
                          key={role.id}
                          value={role.id}
                          selected={role.id == e.roleid}
                        >
                          {role.rolename}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => saveUserRole(e.id)}
                    >
                      Save Changes
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="text-start">
                    {roles.find((role) => role.id === e.roleid)?.rolename}
                  </td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => updateUserRole(e.id, e.roleid)}
                    >
                      Update Role
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/admin/view/employees/${e.id}`)}
                    >
                      {" "}
                      View Employee
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );

  return (
    <>
      <PermissionLock roles={[ADMIN_ROLE]}>
        <AddOfficer />
        <h1>Admin Employee View</h1>
        {contents}
      </PermissionLock>
    </>
  );
};

export default EmployeeList;
