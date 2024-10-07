import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { Employee } from "../Data/Interfaces/EmployeeInterface";
import AddOfficer from "./AddOfficer";

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    getEmployees();
  }, []);

  async function getEmployees() {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "api/Employee/GetEmployees"
    );
    const value = await response.json();

    setEmployees(value);
  }

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
