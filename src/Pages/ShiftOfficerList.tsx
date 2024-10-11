import { useEffect, useState } from "react";
import { Shift } from "../Data/Interfaces/Shift";
import { EmployeeShiftDTO } from "../Data/DTOInterfaces/EmployeeShiftDTO";
import { useApiRequests } from "../Functions/ApiRequests";
import { useAuth0 } from "@auth0/auth0-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EmailRequest } from "../Data/Interfaces/Email";

function ShiftOfficerList() {
  const { addEmployeeShift, getAllShifts, sendEmail } = useApiRequests();
  const { user } = useAuth0();

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
                  onClick={() => {
                    toast.success("Shift Signed Up Successfully");
                    postEmployeeShift(s.id);

                    if (user && user.email) {
                      const email: EmailRequest = {
                        Email: user.email,
                        Subject: "Shift signup notification",
                        MessageBody: ` ${user?.name}, you have signed up to the shift at ${s.location} from ${s.startTime} to ${s.endTime}`,
                      };
                      sendEmail(email);
                    }
                  }}
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
      <ToastContainer position="top-center" />
    </div>
  );
}

export default ShiftOfficerList;
