import { Save } from "lucide-react";
import GNumberInput from "./Generics/gNumberInput";
import { useGNumberInput } from "./Generics/gNumberInputController";
import GTextInput from "./Generics/gTextInput";
import { useGTextInput } from "./Generics/gTextInputController";
import { TableCell, TableRow } from "./ui/table";
import { ShiftDTO } from "@/Data/DTOInterfaces/ShiftDTO";
import { useAddShiftMutation } from "@/Functions/Queries/ShiftQueries";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useAllProjects } from "@/Functions/ProjectRequests";

export const AddShift: React.FC<{ projectId: number }> = ({ projectId }) => {
  const addShiftMutation = useAddShiftMutation(projectId);
  const {data: projects} = useAllProjects();
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const location = useGTextInput("", (v) =>
    v.length === 0 ? "Please add a location" : ""
  );

  useEffect(() => {
    if (projects) {
      const currProject = projects.find((p) => p.id === projectId);

      if (currProject) {
        setStartTime(dayjs(currProject.startDate, "YYYY/MM/DD HH:mm:ss"));
        setEndTime(dayjs(currProject.startDate, "YYYY/MM/DD HH:mm:ss"));
      }
    }
  }, [projects, projectId]);


  const description = useGTextInput("", () => "");

  const reqEmp = useGNumberInput(1, (v) => (v === 0 ? "Invalid Input" : ""));

  function CreateShift() {
    if(!startTime || !endTime)
    {return;}
    const shift: ShiftDTO = {
      StartTime: startTime.format("YYYY/MM/DD HH:mm:ss"),
      EndTime: endTime.format("YYYY/MM/DD HH:mm:ss"),
      Description: description.value,
      Location: location.value,
      RequestedEmployees: reqEmp.value,
      Status: "ACTIVE",
    };
console.log("here")
    addShiftMutation.mutate({ shift, projectId: projectId });
  }

  return (
    <TableRow>
      <TableCell>
        <div>
          <GTextInput control={location} maxLength={50} />
        </div>
      </TableCell>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TableCell className="min-w-36">
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue!)}
          />
        </TableCell>
        <TableCell className="min-w-36">
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue!)}
          />
        </TableCell>
      </LocalizationProvider>
      <TableCell>
        <div>
          <GTextInput control={description} maxLength={199} />
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
       // {/* <div className="text-red-200 bg-red-600 flex justify-center my-7 text-lg">{errorMessage}</div> */} //where to put this?
  );
};
