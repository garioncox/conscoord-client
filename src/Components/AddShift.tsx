import { Minus, Save } from "lucide-react";
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
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

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
    <>
      <TextField
        required
        error={!!(location.hasBeenTouched && location.error !== "")}
        id="outlined-required"
        label="Location"
        value={location.value}
        onChange={(e) => {
          location.setHasBeenTouched(true);
          location.setValue(e.target.value);
        }}
        onBlur={() => location.setHasBeenTouched(true)}
        slotProps={{ htmlInput: { maxLength: 50 } }}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start Date"
          value={selectedStartDate}
          onChange={handleDateChange}
        />
        <div className="flex flex-row grow align-middle">
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue!)}
          />

          <div className="px-1 flex items-center">
            <Minus />
          </div>

          <TimePicker
            maxTime={dayjs().add(24, "hours")}
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue!)}
          />
        </div>
      </LocalizationProvider>

      <TextField
        error={!!(description.hasBeenTouched && description.error !== "")}
        multiline
        rows={4}
        label="Description"
        value={description.value}
        onChange={(e) => {
          description.setHasBeenTouched(true);
          description.setValue(e.target.value);
        }}
        onBlur={() => description.setHasBeenTouched(true)}
        slotProps={{ htmlInput: { maxLength: 50 } }}
      />

      <div onClick={CreateShift} className="text-primary hover:text-secondary">
        <Save />
      </div>
    </>
  );

  return (
    <TableRow>
      <TableCell>
        <GTextInput control={location} maxLength={50} />
      </TableCell>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TableCell>
          <div className="min-w-32">
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
