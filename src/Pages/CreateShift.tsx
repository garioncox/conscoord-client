import { useEffect, useState } from "react";
import { ShiftDTO } from "../Data/DTOInterfaces/ShiftDTO";
import { FormatDate } from "../Functions/FormatDates";
import { useShiftRequests } from "../Functions/ShiftRequests";
import PermissionLock, { CLIENT_ROLE } from "../Components/Auth/PermissionLock";
import { ToastContainer } from "react-toastify";
import { useProjectShiftRequests } from "../Functions/ProjectShiftRequests";
import { useProjectRequests } from "../Functions/ProjectRequests";
import { ProjectShiftDTO } from "../Data/DTOInterfaces/ProjectShiftDTO";
import { useGTextInput } from "../Components/Generics/gTextInputController";
import GTextInput from "../Components/Generics/gTextInput";
import { useGDateInput } from "../Components/Generics/gDateInputController";
import GDateInput from "../Components/Generics/gDateInput";
import GNumberInput from "../Components/Generics/gNumberInput";
import { useGNumberInput } from "../Components/Generics/gNumberInputController";
import GSelectInput from "../Components/Generics/gSelectInput";
import { useGSelectInput } from "../Components/Generics/gSelectInputController";

function CreateShift() {
  const { addShift } = useShiftRequests();
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [requestedEmployees, setRequestedEmployees] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<{
    location?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
    requestedEmployees?: string;
  }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { addProjectShift } = useProjectShiftRequests();
  const { Projects, setProjects, getAllProjects } = useProjectRequests();
  const [ChosenProject, setChosenProject] = useState<number>(-1);

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await getAllProjects();
      setProjects(projects);
    };
    fetchProjects();
  }, []);

  const validateAllInput = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (!startTime) {
      errors.startTime = "Start time is required";
      isValid = false;
    } else if (startTime < today) {
      errors.startTime = "Start time cannot be in the past";
      isValid = false;
    }
    if (!endTime) {
      errors.endTime = "End time is required";
      isValid = false;
    } else if (endTime <= startTime) {
      errors.endTime = "End time must be after start time";
      isValid = false;
    }

    if (requestedEmployees < 1) {
      errors.requestedEmployees = "Requested Officers must be greater than 0";
      isValid = false;
    }
    if (!descriptionControl.value && !descriptionControl.error) {
      errors.description = "Please add a description";
      isValid = false;
    }
    if (!locationControl.value && !locationControl.error) {
      errors.location = "Please add a location";
      isValid = false;
    }
    if (!ChosenProject) {
      errors.ChosenProject = "Project is Required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  async function postShift() {
    setSubmitted(true);
    if (validateAllInput()) {
      const shift: ShiftDTO = {
        StartTime: FormatDate(startTime),
        EndTime: FormatDate(endTime),
        Description: descriptionControl.value,
        Location: locationControl.value,
        RequestedEmployees: requestedEmployees,
        Status: "ACTIVE",
      };
      // createToast(addShift, shift, "Adding Shift");
      const addShiftId: number = await addShift(shift);
      const newProjectShift: ProjectShiftDTO = {
        projectId: ChosenProject,
        shiftId: addShiftId,
      };
      await addProjectShift(newProjectShift);
    } else {
      console.error("Error creaing shift: input not valid");
    }
  }

  //////////////

  const locationControl = useGTextInput("", (s: string) => {
    return s === "" ? "Please add a location" : "";
  });

  const descriptionControl = useGTextInput("", (s: string) => {
    return s === "" ? "Please add a description" : "";
  });

  const startDateControl = useGDateInput("", (s: string) => {
    if (s === "") {
      return "Start date is required";
    }

    const today = new Date().toISOString().split("T")[0];

    if (s < today) {
      return "Start date cannot be in the past";
    }

    return "";
  });

  const endDateControl = useGDateInput("", (s: string) => {
    if (s === "") {
      return "End date is required";
    }

    const today = new Date().toISOString().split("T")[0];

    if (s < today) {
      return "End date cannot be in the past";
    }

    if (startDateControl.value !== "" && s < startDateControl.value) {
      return "End date cannot be before start date";
    }

    return "";
  });

  const psoCountControl = useGNumberInput(1, (n: number) => {
    return n <= 0 ? "Value must be greater than zero" : "";
  });

  const projectSelectControl = useGSelectInput([], (s: string) => {
    return s === "" ? "Please select a project" : "";
  });
  //////////////

  const content = (
    <>
      <form>
        <h1>Create a New Shift</h1>
        <div className="row">
          <div className="col-md-8 mb-3">
            <GTextInput
              control={locationControl}
              label="Location"
              placeholder={"North Side"}
              maxLength={50}
            />
          </div>

          <div className="col-md-2 mb-3">
            <GDateInput control={startDateControl} label="Start" />
          </div>

          <div className="col-md-2 mb-3">
            <GDateInput control={endDateControl} label="End" />
          </div>

          <div className="row">
            <div className="col-12 mb-3">
              <GTextInput
                control={descriptionControl}
                label="Description"
                placeholder={"Traffic Control"}
                maxLength={200}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-8 mb-3">
              <GNumberInput
                label={"Requested Number of Officers"}
                control={psoCountControl}
                minimum={1}
                maximum={100}
              />
            </div>

            <div className="col-md-4 mb-3">
              {/* TODO: Only display projects that are connected to the signed in company */}
              {/* <label htmlFor="ChosenProject">Choose A Project</label>
              <select
                className="form-select"
                name="ChosenProject"
                onChange={(e) => setChosenProject(Number(e.target.value))}
                defaultValue=""
              >
                <option value="" />
                {Projects?.map((pShift) => (
                  <option key={pShift.id} value={pShift.id}>
                    {pShift.name}
                  </option>
                ))}
              </select> */}
              <GSelectInput
                label={"Choose a Project"}
                control={projectSelectControl}
              />
            </div>
          </div>
        </div>
        <button className="btn btn-primary" type="button" onClick={postShift}>
          Create Shift
        </button>
        <ToastContainer position="bottom-right" />
      </form>
    </>
  );

  return (
    <>
      <PermissionLock roles={[CLIENT_ROLE]}>{content}</PermissionLock>
    </>
  );
}

export default CreateShift;
