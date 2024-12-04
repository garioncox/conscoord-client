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
import { useState } from "react";
import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const AddShift: React.FC<{ projectId: number }> = ({ projectId }) => {
  const addShiftMutation = useAddShiftMutation(projectId);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    null
  );
  const location = useGTextInput("", (v) =>
    v.length === 0 ? "Please add a location" : ""
  );

  const description = useGTextInput("", () => "");

  const reqEmp = useGNumberInput(1, (v) => (v === 0 ? "Invalid Input" : ""));

  function CreateShift() {
    if (!startTime || !endTime) {
      return;
    }
    const shift: ShiftDTO = {
      StartTime: startTime.format("YYYY/MM/DD HH:mm:ss"),
      EndTime: endTime.format("YYYY/MM/DD HH:mm:ss"),
      Description: description.value,
      Location: location.value,
      RequestedEmployees: reqEmp.value,
      Status: "ACTIVE",
    };
    addShiftMutation.mutate({ shift, projectId: projectId });
  }

  function handleDateChange(newValue: Dayjs | null) {
    if (newValue) {
      setSelectedStartDate(newValue);
      setStartTime(newValue);
      setEndTime(newValue);
    }
  }

  return (
    <TableRow>
      <TableCell>
        <GTextInput control={location} maxLength={50} />
      </TableCell>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TableCell>
          <div className="min-w-36">
            <DatePicker
              label="Start Date"
              value={selectedStartDate}
              onChange={handleDateChange}
            />
          </div>
        </TableCell>
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
        <div className="min-w-14">
          <GNumberInput control={reqEmp} />
        </div>
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
