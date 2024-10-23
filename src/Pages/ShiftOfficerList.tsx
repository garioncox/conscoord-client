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
import ProjectList from "./ProjectList";
import { useProjectRequests } from "../Functions/ProjectRequests";
import { Project } from "../Data/Interfaces/Project";
import ProjectShift from "../Data/Interfaces/ProjectShift";
import { useProjectShiftRequests } from "../Functions/ProjectShiftRequests";

function ShiftOfficerList() {
  const { addEmployeeShift, getSignedUpShifts, deleteEmployeeShift } =
    useEmpShiftRequests();
  const { getEmployeeByEmail } = useEmployeeRequests();
  const { getAllShifts } = useShiftRequests();
  const { getAllProjects } = useProjectRequests();
  const { getAllProjectShifts } = useProjectShiftRequests();
  const { sendEmail } = useEmailRequests();
  const { createToast } = useCustomToast();
  const { user } = useAuth0();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectShifts, setProjectShifts] = useState<ProjectShift[]>([]);
  const [claimedShifts, setClaimedShifts] = useState<Shift[]>([]);

  useEffect(() => {
    populateShifts();
    populateProjects();
    populateProjectShifts();
    console.log(projects);
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

        <h1>Pick a Shift</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Location</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            <div className="accordion">
              {projects.map((p) => (
                <div className="accordion-item">
                  <div className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${p.id}`}
                      aria-expanded="true"
                      aria-controls={`collapse${p.id}`}
                    >
                      {p.name}
                    </button>
                  </div>
                  <div
                    id={`collapse${p.id}`}
                    className="accordion-collapse collapse"
                    data-bs-parent="#accordionExample"
                  >
                    {shifts
                      .filter((s) =>
                        projectShifts.some(
                          (ps) => ps.shiftId === s.id && ps.projectId === p.id
                        )
                      )
                      .map((s) => (
                        <div className="accordion-body">
                          <tr key={s.id}>
                            <td>{s.location}</td>
                            <td>{s.startTime}</td>
                            <td>{s.endTime}</td>
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  createToast(
                                    postEmployeeShift,
                                    s.id,
                                    "Signing up for shift..."
                                  );

                                  setClaimedShifts((prevClaimedShifts) => [
                                    ...prevClaimedShifts,
                                    s,
                                  ]);
                                  setShifts(
                                    shifts?.filter((shift) => shift.id !== s.id)
                                  );

                                  if (user && user.email) {
                                    const email: EmailRequest = {
                                      email: user.email,
                                      subject: "Shift signup notification",
                                      messageBody: ` ${user?.name}, you have signed up to the shift at ${s.location} from ${s.startTime} to ${s.endTime}`,
                                    };
                                    sendEmail(email);
                                  }
                                }}
                              >
                                Take This Shift
                              </button>
                            </td>
                          </tr>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </tbody>
        </table>
      </>
    );

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

  async function populateProjects() {
    setProjects(await getAllProjects());
  }

  async function populateProjectShifts() {
    setProjectShifts(await getAllProjectShifts());
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
