import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Employee } from "../Data/Interfaces/EmployeeInterface";
import { Shift } from "../Data/Interfaces/Shift";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { useEmpShiftRequests } from "../Functions/EmpShiftRequests";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployees] = useState<Employee>();
  const [shift, setShift] = useState<Shift[]>();
  
  useEffect(() => {
    getEmployee();
  }, []);

  const { getEmployeeById } = useEmployeeRequests();
  const { getSignedUpShifts } = useEmpShiftRequests();

  async function getEmployee() {
    if (id === undefined) {
      return
    }
    const response = await getEmployeeById(Number(id));
    setEmployees(response);

    const shiftresponse = await getSignedUpShifts(response.email);
    setShift(shiftresponse);
  }

  function employeeDetails() {
    return employee != undefined ? (
      <>
        <h1>{employee?.name}</h1>
        <h2>{employee.email}</h2>
        <h2>{employee.phonenumber}</h2>
      </>
    ) : (
      <div>No employee found with that Id</div>
    );
  }
  function shiftDetails() {
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-start">Shift Details</th>
            <th className="text-start">Location</th>
            <th className="text-start">Start Time</th>
            <th className="text-start">End Time</th>
            <th className="text-start">Status</th>
          </tr>
        </thead>
        <tbody>
          {shift?.map((s) => (
            <tr>
              <td className="text-start">{s.description}</td>
              <td className="text-start">{s.location}</td>
              <td className="text-start">{s.startTime}</td>
              <td className="text-start">{s.startTime}</td>
              <td className="text-start">{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return (
    <>
      <div>{employeeDetails()}</div>
      <div>{shiftDetails()}</div>
    </>
  );
};
export default EmployeeDetails;