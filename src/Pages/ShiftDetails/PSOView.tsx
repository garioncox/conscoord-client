import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { useEmpShiftMutation } from "@/Functions/Queries/EmployeeShiftQueries";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";

interface PSOViewProps {
  currentEmpShift: EmployeeShift | undefined;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  isFormDisabled: boolean;
  setStartTime: Dispatch<SetStateAction<Dayjs | null>>;
  setEndTime: Dispatch<SetStateAction<Dayjs | null>>;
}

const PSOView: React.FC<PSOViewProps> = ({
  currentEmpShift,
  startTime,
  endTime,
  isFormDisabled,
  setStartTime,
  setEndTime,
}) => {
  
  const empShiftMutation = useEmpShiftMutation();

  function SaveShiftTimes(): void {
    if (!(currentEmpShift && startTime && endTime)) {
      console.log("conditions were not met");
      return;
    }

    const startPad = String(startTime.get("minute")).length <= 1 ? "0" : "";
    const endPad = String(endTime.get("minute")).length <= 1 ? "0" : "";

    const newEmpShift: EmployeeShiftDTO = {
      id: currentEmpShift.id,
      clockInTime: `${startTime.get("hour")}:${startPad}${startTime.get(
        "minute"
      )}`,
      clockOutTime: `${endTime.get("hour")}:${endPad}${endTime.get("minute")}`,
      employeeId: currentEmpShift.empId,
      shiftId: currentEmpShift.shiftId,
    };

    empShiftMutation.mutate(newEmpShift);
  }

  return (
    <div
      className={`mt-7 justify-center w-full ${
        !currentEmpShift ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            disabled={isFormDisabled}
          />
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            disabled={isFormDisabled}
          />
        </LocalizationProvider>
      </div>
      <button
        className={`text-white font-semibold py-3 px-6 w-full rounded-lg mt-4 ${
          isFormDisabled
            ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={() => SaveShiftTimes()}
        disabled={isFormDisabled}
      >
        Submit Time
      </button>
      {!currentEmpShift ? (
        <p className="mt-4 text-red-500 font-semibold text-center">
          You have not signed up for this shift
        </p>
      ) : currentEmpShift.clockInTime && currentEmpShift.clockOutTime ? (
        <div className="mt-4 text-center">
          <p className="text-green-600 font-semibold">
            Start time now set at: {currentEmpShift.clockInTime}
          </p>
          <p className="text-green-600 font-semibold">
            End time now set at: {currentEmpShift.clockOutTime}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default PSOView;
