import { useEffect, useState } from "react";
import { Shift } from "../Data/Interfaces/Shift";
import { EmployeeShiftDTO } from "../Data/DTOInterfaces/EmployeeShiftDTO";
import { useShiftRequests } from "../Functions/ShiftRequests";
import { useEmpShiftRequests } from "../Functions/EmpShiftRequests";
import { useEmailRequests } from "../Functions/EmailRequests";
import { useAuth0 } from "@auth0/auth0-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EmailRequest } from "../Data/Interfaces/Email";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { useProjectRequests } from "../Functions/ProjectRequests";
import { Project } from "../Data/Interfaces/Project";
import ProjectShift from "../Data/Interfaces/ProjectShift";
import { useProjectShiftRequests } from "../Functions/ProjectShiftRequests";
import PermissionLock, { PSO_ROLE } from "../Components/Auth/PermissionLock";
import { useCustomToast } from "../Components/Toast";

function ShiftOfficerList() {
  const {
    addEmployeeShift,
    getSignedUpShifts,
    getAllEmployeeShifts,
  } = useEmpShiftRequests();
  const { getEmployeeByEmail } = useEmployeeRequests();
  const { getAllShifts } = useShiftRequests();
  const { getAllProjects } = useProjectRequests();
  const { getAllProjectShifts } = useProjectShiftRequests();
  const { sendEmail } = useEmailRequests();
  const { user } = useAuth0();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectShifts, setProjectShifts] = useState<ProjectShift[]>([]);
  // const [claimedShifts, setClaimedShifts] = useState<Shift[]>([]);
  const [fulfilledShifts, setFulfilledShifts] = useState({});

  useEffect(() => {
    populateShifts();
    populateProjects();
    populateProjectShifts();
  }, [user?.email]);

  useEffect(() => {
    const fetchFulfilledShifts = async() => {
      const results = await Promise.all(
        shifts.map(s => getFulfilledShifts(s.id))
      );
      const fulfilledMap: Record<string, number | null> = {};
      shifts.forEach((shift, index) => {
          fulfilledMap[shift.id] = results[index];
      });
      setFulfilledShifts(fulfilledMap);
    };

    fetchFulfilledShifts();
  }, [shifts])

  const contents =
    shifts === undefined ? (
      <div className="spinner-border" role="status" />
    ) : (
      <>
        <h1>Pick a Shift</h1>
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
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Location</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Requested Officers</th>
                                <th>Signed Up Officers</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                          <tr key={s.id}>
                            <td>{s.location}</td>
                            <td>{s.startTime}</td>
                            <td>{s.endTime}</td>
                            <td>{s.requestedEmployees}</td>
                            <td>{fulfilledShifts[s.id] || 0}</td>
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  takeShift(s);
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
                          </tbody>
                          </table>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
      </>
    );

  async function populateShifts() {
    if (user && user.email !== undefined) {
      const claimed = await getSignedUpShifts(user.email);
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

  async function getFulfilledShifts(id: number) {
    const allTakenShifts = (await getAllEmployeeShifts()).filter(
      (es) => es.shiftId == id
    );
    return allTakenShifts.length;
  }

  async function takeShift(s: Shift) {
    const allTakenShifts = (await getAllEmployeeShifts()).filter(
      (es) => es.shiftId == s.id
    );
    if (allTakenShifts.length >= s.requestedEmployees) {
      toast.error("Sorry, Maximum number of officers reached");
    } else if (user && user.email) {
      const currUser = await getEmployeeByEmail(user.email);
      const employee: EmployeeShiftDTO = {
        EmployeeId: currUser.id,
        ShiftId: s.id,
      };
      await createToast(addEmployeeShift, employee, "Signing up for shift...");

      setShifts(shifts?.filter((shift) => shift.id !== s.id));
    }
  }

  return (
    <PermissionLock roles={[PSO_ROLE]}>
      {contents}
      <ToastContainer position="top-center" />
    </PermissionLock>
  );
}

export default ShiftOfficerList;
