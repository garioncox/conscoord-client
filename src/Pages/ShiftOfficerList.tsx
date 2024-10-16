import { useEffect, useState } from "react";
import { Shift } from "../Data/Interfaces/Shift";
import { EmployeeShiftDTO } from "../Data/DTOInterfaces/EmployeeShiftDTO";
import { useShiftRequests } from "../Functions/ShiftRequests";
import { useEmpShiftRequests } from "../Functions/EmpShiftRequests";
import { useEmailRequests } from "../Functions/EmailRequests";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EmailRequest } from "../Data/Interfaces/Email";
import PermissionLock, { PSO_ROLE } from "../Components/PermissionLock";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { useCustomToast } from "../Components/Toast";

function ShiftOfficerList() {
  const { addEmployeeShift, getSignedUpShifts, deleteEmployeeShift } = useEmpShiftRequests();
  const { getEmployeeByEmail } = useEmployeeRequests();
  const { getAllShifts } = useShiftRequests();
  const { sendEmail } = useEmailRequests();
  const { createToast } = useCustomToast();
  const { user } = useAuth0();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [claimedShifts, setClaimedShifts] = useState<Shift[]>([]);

  useEffect(() => {
    populateShifts();
  }, [user?.email]);

  const contents =
    shifts === undefined ? (
      <div className="spinner-border" role="status" />
    ) : (
      <>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Location</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {claimedShifts?.map((s) => (
              <tr key={s.id}>
                <td>{s.location}</td>
                <td>{s.startTime}</td>
                <td>{s.endTime}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={async () => {
                      await createToast(deleteEmployeeShift, s.id, "Deleting shift...");
                      setClaimedShifts(claimedShifts.filter(shift => shift.id !== s.id))
                      setShifts((prevShifts) => [...prevShifts, s])
                    }
                    }
                  >
                    Resign from shift
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />

        <h1>Shifts Still Open</h1>
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
                      createToast(postEmployeeShift, s.id, "Signing up for shift...");

                      setClaimedShifts((prevClaimedShifts) => [...prevClaimedShifts, s]);
                      setShifts(shifts?.filter(shift => shift.id !== s.id))


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
      </>
    );

  async function populateShifts() {
    if (user && user.email !== undefined) {
      const claimed = await getSignedUpShifts(user.email);
      setClaimedShifts(claimed);

      const allShifts = await getAllShifts();

      const availableShifts = allShifts.filter(shift =>
        !claimed.some(claimedShift =>
          claimedShift.id === shift.id
        )
      );

      setShifts(availableShifts);
    }
  }


  async function postEmployeeShift(id: number) {
    if (user && user.email) {
      const currUser = await getEmployeeByEmail(user.email);
      const employee: EmployeeShiftDTO = {
        EmployeeId: currUser.id,
        ShiftId: id,
      };

      await addEmployeeShift(employee);
    }
  }

  return (
    <PermissionLock roles={[PSO_ROLE]}>
      <h1 id="shifts">My Shifts</h1>
      {contents}
      <ToastContainer position="top-center" />
    </PermissionLock>
  );
}

export default ShiftOfficerList;
