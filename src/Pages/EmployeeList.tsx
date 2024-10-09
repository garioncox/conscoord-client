import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import AddOfficer from "./AddOfficer";
import {
  useGetEmployees,
  useGetRoleName,
  useGetRoles,
} from "../Functions/EmployeeListFunctions";

const EmployeeList = () => {
  const { employees, fetchEmployees } = useGetEmployees();
  const { roles, fetchRoles } = useGetRoles();

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  const navigate = useNavigate();

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
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr
              key={e.id}
              className="grow grow:hover"
              onClick={() => navigate(`/admin/view/employees/${e.id}`)}
            >
              <td className="text-start">{e.name}</td>
              <td className="text-start">{e.phonenumber}</td>
              <td className="text-start">{e.email}</td>
              <td className="text-start">{useGetRoleName(roles, e.roleid)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );

  return (
    <>
      <AddOfficer />
      <h1>Admin Employee View</h1>
      {contents}
    </>
  );
};

export default EmployeeList;
