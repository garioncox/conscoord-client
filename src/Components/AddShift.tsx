import { Save } from "lucide-react";
import GDateInput from "./Generics/gDateInput";
import GNumberInput from "./Generics/gNumberInput";
import { useGNumberInput } from "./Generics/gNumberInputController";
import GTextInput from "./Generics/gTextInput";
import { useGTextInput } from "./Generics/gTextInputController";
import { TableCell, TableRow } from "./ui/table";
import { ShiftDTO } from "@/Data/DTOInterfaces/ShiftDTO";
import { FormatDate } from "@/Functions/FormatDates";
import { useGDateInput } from "./Generics/gDateInputController";
import { useAddShiftMutation } from "@/Functions/Queries/ShiftQueries";

export const AddShift: React.FC<{ projectId: number }> = ({ projectId }) => {
  const addShiftMutation = useAddShiftMutation();
  const today = new Date().toISOString().split("T")[0];

  const location = useGTextInput("", (v) =>
    v.length === 0 ? "Please add a location" : ""
  );

  const startDate = useGDateInput("", (s: string) => {
    if (s === "") {
      return "Start date is required";
    }
    if (s < today) {
      return "Start date cannot be in the past";
    }

    return "";
  });

  const endDate = useGDateInput("", (s: string) => {
    if (s === "") {
      return "End date is required";
    }
    if (s < today) {
      return "End date cannot be in the past";
    }
    if (startDate.value !== "" && s < endDate.value) {
      return "End date cannot be before start date";
    }
    return "";
  });

  const description = useGTextInput("", (v) =>
    v.length === 0 ? "Please add a description" : ""
  );

  const reqEmp = useGNumberInput(0, (v) => (v === 0 ? "Error" : ""));

  function CreateShift() {
    const shift: ShiftDTO = {
      StartTime: FormatDate(startDate.value),
      EndTime: FormatDate(endDate.value),
      Description: description.value,
      Location: location.value,
      RequestedEmployees: reqEmp.value,
      Status: "ACTIVE",
    };

    addShiftMutation.mutate({ shift, projectId: projectId });

    location.setValue("");
    description.setValue("");
    startDate.setValue("");
    endDate.setValue("");
    reqEmp.setValue(0);
  }

  return (
    <TableRow>
      <TableCell>
        <div>
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
      <TableCell>
        <div>
          <GTextInput control={description} />
        </div>
      </TableCell>
      <TableCell>
        <GNumberInput control={reqEmp} />
      </TableCell>
      <TableCell>
        <div
          onClick={CreateShift}
          className="text-primary hover:text-secondary"
        >
          <Save />
        </div>
      </TableCell>
    </TableRow>
  );
};
