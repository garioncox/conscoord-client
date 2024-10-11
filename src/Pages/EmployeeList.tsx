import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import AddOfficer from "./AddOfficer";
import {
  useGetEmployees,
  useGetRoles,
} from "../Functions/EmployeeListFunctions";
import Role from "../Data/Interfaces/RoleInterface";

const EmployeeList = () => {
  const { employees, fetchEmployees } = useGetEmployees();
  const { roles, fetchRoles } = useGetRoles();
  const [selectedRole, setSelectedRole] = useState<number | undefined>(-1);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(-1);

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  const navigate = useNavigate();

  const updateUserRole = (employeeId: number, currentRoleId: number) => {
    setSelectedEmployee(employeeId);
    setSelectedRole(currentRoleId);
  };

  const saveUserRole = () => {
    //set the role id here
    // setSelectedEmployee(null);
    // setSelectedRole(undefined);  
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
            <tr
              key={e.id}
              className="grow grow:hover"
              // onClick={() => navigate(`/admin/view/employees/${e.id}`)}
            >
              <td className="text-start">{e.name}</td>
              <td className="text-start">{e.phonenumber}</td>
              <td className="text-start">{e.email}</td>

              {selectedEmployee === e.id ? (
              <>
                <td className="text-start">
                  {/* <label htmlFor="selectRole">Select Role</label> */}
                  <select
                    className="form-select"
                    name="selectRole"
                    onChange={(e) => {
                         const selectedRoleId = roles.find((role: Role) => role.rolename === e.target.value)?.id;
                         setSelectedRole(selectedRoleId ?? 1);
                       }}                  >
                    <option value="">
                      Default (No Role)
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.rolename}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button className="btn btn-info" onClick={saveUserRole}>
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
      <AddOfficer />
      <h1>Admin Employee View</h1>
      <div>Selected Role is {selectedRole}</div>
      {contents}
    </>
  );
};

export default EmployeeList;
