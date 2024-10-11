import { useEffect, useState } from "react";
import { Shift } from "../Data/Interfaces/Shift";
import { EmployeeShiftDTO } from "../Data/DTOInterfaces/EmployeeShiftDTO";
import { useShiftRequests } from "../Functions/ShiftRequests";
import { useEmpShiftRequests } from "../Functions/EmpShiftRequests";

function ShiftOfficerList() {
  const {addEmployeeShift} = useEmpShiftRequests();
  const {getAllShifts} = useShiftRequests();
  const [shifts, setShifts] = useState<Shift[]>();

  useEffect(() => {
    populateShifts();
  }, []);

  const contents =
    shifts === undefined ? (
      <div className="spinner-border" role="status" />
    ) : (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Location</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((s) => (
            <tr key={s.id}>
              <td>{s.location}</td>
              <td>{s.startTime}</td>
              <td>{s.endTime}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => postEmployeeShift(s.id)}
                >
                  Take This Shift
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

  async function populateShifts() {
    setShifts(await getAllShifts());
  }

  async function postEmployeeShift(id: number) {
    const employee: EmployeeShiftDTO = {
      EmployeeId: 1,
      ShiftId: id,
    };

    await addEmployeeShift(employee);
  }

  return (
    <div>
      <h1 id="shifts">Shift List</h1>
      {contents}
    </div>
  );
}

export default ShiftOfficerList;
