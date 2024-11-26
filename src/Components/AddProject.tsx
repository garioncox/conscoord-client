import { Save } from "lucide-react";
import GDateInput from "./Generics/gDateInput";
import GTextInput from "./Generics/gTextInput";
import { useGTextInput } from "./Generics/gTextInputController";
import { TableCell, TableRow } from "./ui/table";
import { useGDateInput } from "./Generics/gDateInputController";
// import { useProjectRequests } from "@/Functions/ProjectRequests";
import { ProjectDTO } from "@/Data/DTOInterfaces/ProjectDTO";
import { FormatDate } from "@/Functions/FormatDates";
import { useAddProjectMutation } from "@/Functions/Queries/ProjectQueries";

export function AddProject() {
  const location = useGTextInput("", (v) =>
    v.length === 0 ? "Pleae add a location" : ""
  );
  const startDate = useGDateInput("", (s: string) => {
    if (s === "") {
      return "Start date is required";
    }

    const today = new Date().toISOString().split("T")[0];

    if (s < today) {
      return "Start date cannot be in the past";
    }

    return "";
  });
  const endDate = useGDateInput("", (s: string) => {
    if (s === "") {
      return "End date is required";
    }

    const today = new Date().toISOString().split("T")[0];

    if (s < today) {
      return "End date cannot be in the past";
    }
    if (startDate.value !== "" && s < endDate.value) {
      return "End date cannot be before start date";
    }

    return "";
  });
  const description = useGTextInput("", (v) =>
    v.length === 0 ? "Please add a name" : ""
  );

  const addProject = useAddProjectMutation();

  function AddProject() {
    const project: ProjectDTO = {
      name: description.value,
      location: location.value,
      startDate: FormatDate(startDate.value),
      endDate: FormatDate(endDate.value),
    };
    addProject.mutate({ project });

    location.setValue("");
    description.setValue("");
    startDate.setValue("");
    endDate.setValue("");
  }

  return (
    <TableRow>
      <TableCell>
        <div>
          <GTextInput control={description} />
        </div>
      </TableCell>
      <TableCell>
        <div className="">
          <GTextInput control={location} />
        </div>
      </TableCell>
      <TableCell>
        <div>
          <GDateInput control={startDate} />
        </div>
      </TableCell>
      <TableCell>
        <div>
          <GDateInput control={endDate} />
        </div>
      </TableCell>
      <TableCell>ACTIVE</TableCell>
      <TableCell>
        <div onClick={AddProject} className="text-primary hover:text-secondary">
          <Save />
        </div>
      </TableCell>
    </TableRow>
  );
}
