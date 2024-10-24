import { useEffect, useState } from "react";
import { Shift } from "../Data/Interfaces/Shift";
import { useEmailRequests } from "../Functions/EmailRequests";
import PermissionLock, { PSO_ROLE } from "../Components/PermissionLock";
import { ToastContainer } from "react-toastify";
import { EmailRequest } from "../Data/Interfaces/Email";
import { useAuth0 } from "@auth0/auth0-react";
import { useEmpShiftRequests } from "../Functions/EmpShiftRequests";
import { useCustomToast } from "../Components/Toast";
import { useShiftRequests } from "../Functions/ShiftRequests";

function MyShifts() {
    const { sendEmail } = useEmailRequests();
    const {deleteEmployeeShift, getSignedUpShifts} = useEmpShiftRequests();
    const { createToast } = useCustomToast();
    const { getAllShifts} = useShiftRequests();
    const { user } = useAuth0();

    const [claimedShifts, setClaimedShifts] = useState<Shift[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);

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
                      await createToast(
                        deleteEmployeeShift,
                        s.id,
                        "Deleting shift..."
                      );
                      setClaimedShifts(
                        claimedShifts.filter((shift) => shift.id !== s.id)
                      );
                      setShifts((prevShifts) => [...prevShifts, s]);

                      if (user && user.email) {
                        const email: EmailRequest = {
                          email: user.email,
                          subject: "Shift resignation notification",
                          messageBody: ` ${user?.name}, you have resigned from the shift at ${s.location} from ${s.startTime} to ${s.endTime}. \n\n
                            If you did not resign from this shift, please secure your account, otherwise you can disregard this email.`,
                        };
                        sendEmail(email);
                      }
                    }}
                  >
                    Resign from shift
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        </>
    )

    async function populateShifts() {
        if (user && user.email !== undefined) {
          const claimed = await getSignedUpShifts(user.email);
          setClaimedShifts(claimed);
          
    
          const allShifts = await getAllShifts();
    
          const availableShifts = allShifts.filter(
            (shift) => !claimed.some((claimedShift) => claimedShift.id === shift.id)
          );
    
          setShifts(availableShifts);
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

export default MyShifts;