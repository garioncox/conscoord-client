import { useEffect } from "react";
import { ShiftDTO } from "../Data/DTOInterfaces/ShiftDTO";
import { FormatDate } from "../Functions/FormatDates";
import { useShiftRequests } from "../Functions/ShiftRequests";
import PermissionLock, { CLIENT_ROLE } from "../Components/Auth/PermissionLock";
import { toast } from "react-toastify";
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
import { useCustomToast } from "../Components/Toast";

function CreateShift() {
  const { addShift } = useShiftRequests();
  const { addProjectShift } = useProjectShiftRequests();
  const { Projects, setProjects, getAllProjects } = useProjectRequests();
  const { createToast } = useCustomToast();

  // TODO: Extract out into TanStack
  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await getAllProjects();
      setProjects(projects);
    };
    fetchProjects();
  }, []);

  async function postShift() {
    locationControl.setHasBeenTouched(true);
    descriptionControl.setHasBeenTouched(true);
    startDateControl.setHasBeenTouched(true);
    endDateControl.setHasBeenTouched(true);
    psoCountControl.setHasBeenTouched(true);
    projectSelectControl.setHasBeenTouched(true);

    if (
      locationControl.error ||
      descriptionControl.error ||
      startDateControl.error ||
      endDateControl.error ||
      psoCountControl.error ||
      projectSelectControl.error
    ) {
      toast.error("Invalid form");
      console.error("Invalid form submission");
      return;
    }

    const shift: ShiftDTO = {
      StartTime: FormatDate(startDateControl.value),
      EndTime: FormatDate(endDateControl.value),
      Description: descriptionControl.value,
      Location: locationControl.value,
      RequestedEmployees: psoCountControl.value,
      Status: "ACTIVE",
    };
    const addShiftId: number = await createToast(addShift, shift, "Adding Shift");
    
    const newProjectShift: ProjectShiftDTO = {
      projectId: Projects!.find((p) => p.name == projectSelectControl.value)!
      .id,
      shiftId: addShiftId,
    };
    await addProjectShift(newProjectShift);
    toast.success("Added project!");

    clearFormData();
  }

  function clearFormData() {

    locationControl.setValue("");
    descriptionControl.setValue("");
    startDateControl.setValue("");
    endDateControl.setValue("");
    psoCountControl.setValue(1);
    projectSelectControl.setValue("");

    locationControl.setHasBeenTouched(false);
    descriptionControl.setHasBeenTouched(false);
    startDateControl.setHasBeenTouched(false);
    endDateControl.setHasBeenTouched(false);
    psoCountControl.setHasBeenTouched(false);
    projectSelectControl.setHasBeenTouched(false);
  }

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

  const projectSelectControl = useGSelectInput(
    Projects ? Projects?.map((p) => p.name) : [],
    (s: string) => {
      return s === "" ? "Please select a project" : "";
    }
  );

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
