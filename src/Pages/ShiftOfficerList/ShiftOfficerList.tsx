import * as Imports from "./ShiftOfficerListImports";
import useCustomFunctions from "./ShiftOfficerListFunctions";
import useCustomVariables from "./ShiftOfficerListVariables";

function ShiftOfficerList() {
  const Variables = useCustomVariables();
  const Functions = useCustomFunctions();

  const contents =
    Variables.shifts === undefined ? (
      <div className="spinner-border" role="status" />
    ) : (
      <>
        <h1>Pick a Shift</h1>
        <div className="accordion">
          {Variables.projects.map((p) => (
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
                {Variables.shifts
                  .filter((s) =>
                    Variables.projectShifts.some(
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
                                  Functions.takeShift(s);
                                  if (Variables.user && Variables.user.email) {
                                    const email: Imports.EmailRequest = {
                                      email: Variables.user.email,
                                      subject: "Shift signup notification",
                                      messageBody: ` ${Variables.user?.name}, you have signed up to the shift at ${s.location} from ${s.startTime} to ${s.endTime}`,
                                    };
                                    Variables.sendEmail(email);
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

  return (
    <Imports.PermissionLock roles={[Imports.PSO_ROLE]}>
      {contents}
    </Imports.PermissionLock>
  );
}

export default ShiftOfficerList;
