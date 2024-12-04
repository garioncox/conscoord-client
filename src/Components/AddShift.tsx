import { Save } from "lucide-react";
import GNumberInput from "./Generics/gNumberInput";
import { useGNumberInput } from "./Generics/control/gNumberInputController";
import GTextInput from "./Generics/gTextInput";
import { useGTextInput } from "./Generics/control/gTextInputController";
import { TableCell, TableRow } from "./ui/table";
import { ShiftDTO } from "@/Data/DTOInterfaces/ShiftDTO";
import { useAddShiftMutation } from "@/Functions/Queries/ShiftQueries";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CustomTimePicker from "./Generics/CustomTimePicker";
import { useCustomTimePickerControl } from "./Generics/control/CustomTimePickerControl";

export const AddShift: React.FC<{ projectId: number }> = ({ projectId }) => {
  const addShiftMutation = useAddShiftMutation(projectId);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<{
    startTime?: boolean;
    endTime?: boolean;
    location?: boolean;
    reqEmp?: boolean;
  }>({});

  const location = useGTextInput("", (v) =>
    v.length === 0 ? "Please add a location" : ""
  );
  const description = useGTextInput("", () => "");
  const reqEmp = useGNumberInput(1, (v) => (v === 0 ? "Invalid Input" : ""));
  const startTime = useCustomTimePickerControl(null, (value: Dayjs | null) =>
    value ? "" : "error"
  );

  const validateShift = () => {
    const errors: typeof validationErrors = {};

    if (!startTime.value) errors.startTime = true;
    if (!endTime) errors.endTime = true;
    if (location.value.length === 0) errors.location = true;
    if (reqEmp.value <= 0) errors.reqEmp = true;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  function CreateShift() {
    startTime.setHasBeenTouched(true);

    if (validateShift()) {
      const shift: ShiftDTO = {
        StartTime: startTime.value!.format("YYYY/MM/DD HH:mm:ss"),
        EndTime: endTime!.format("YYYY/MM/DD HH:mm:ss"),
        Description: description.value,
        Location: location.value,
        RequestedEmployees: reqEmp.value,
        Status: "ACTIVE",
      };
      addShiftMutation.mutate({ shift, projectId: projectId });
    }
  }

  function handleDateChange(newValue: Dayjs | null) {
    if (newValue) {
      setSelectedStartDate(newValue);
      startTime.setValue(newValue);
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
          <div className="min-w-32">
            <DatePicker
              label="Start Date"
              value={selectedStartDate}
              onChange={handleDateChange}
            />
          </div>
        </TableCell>
        <TableCell className="min-w-36">
          {/* <TimePicker
            label="Start Time"
            sx={
              validationErrors.startTime
                ? {
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "red",
                      },
                      "&:hover fieldset": {
                        borderColor: "blue",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "red",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      "&.Mui-focused": {
                        color: "red",
                      },
                    },
                  }
                : {}
            }
            value={startTime}
            onChange={(newValue) => setStartTime(newValue!)}
          /> */}
          <CustomTimePicker label="Start Time" control={startTime} />
        </TableCell>
        <TableCell className="min-w-36">
          <TimePicker
            label="End Time"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "red",
                },
                "&:hover fieldset": {
                  borderColor: "green",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "red",
                },
              },
            }}
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
