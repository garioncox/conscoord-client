import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { useShiftById } from "@/Functions/Queries/ShiftQueries";
import { Spinner } from "@/Components/Spinner";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import {
  useEmpShiftMutation,
  useEmpShiftsForLoggedInUser,
} from "@/Functions/Queries/EmployeeShiftQueries";

export const ShiftDetails = () => {
  const { id } = useParams();
  const { data: claimedShifts, isLoading: isClaimedShiftsLoading } =
    useEmpShiftsForLoggedInUser();
  const { data: shiftFromParam, isLoading: isShiftFromParamLoading } =
    useShiftById(Number(id));
  const empShiftMutation = useEmpShiftMutation();

  const [currentEmpShift, setCurrentEmpShift] = useState<
    EmployeeShift | undefined
  >(undefined);
  const [StartTime, setStartTime] = useState<Dayjs | null>(
    dayjs("2022-04-17T15:30")
  );
  const [EndTime, setEndTime] = useState<Dayjs | null>(
    dayjs("2022-04-17T15:30")
  );

  useEffect(() => {
    if (id && !isClaimedShiftsLoading) {
      setCurrentEmpShift(
        claimedShifts?.find((cs) => cs.shiftId === Number(id))
      );
    }
  }, [claimedShifts, id, isClaimedShiftsLoading]);

  function SaveShiftTimes(): void {
    if (!(currentEmpShift && StartTime && EndTime)) {
      console.log("conditions were not met");
      return;
    }

    const newEmpShift: EmployeeShiftDTO = {
      id: currentEmpShift.id,
      clockInTime: `${StartTime.get("hour") + ":" + StartTime.get("minute")}`,
      clockOutTime: `${EndTime.get("hour") + ":" + EndTime.get("minute")}`,
      employeeId: currentEmpShift.employeeId,
      shiftId: currentEmpShift.shiftId,
    };

    empShiftMutation.mutate(newEmpShift);
  }

  if (isClaimedShiftsLoading || isShiftFromParamLoading) {
    return <Spinner />;
  }

  return (
    <>
      {shiftFromParam ? (
        <div>
          <div className="border border-gray-300 rounded-lg p-6 max-w-md mx-auto shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 ">
              Shift Details
            </h3>
            <p className="text-gray-600 mb-2">{shiftFromParam.location}</p>
            <p className="text-gray-600 mb-2">{shiftFromParam.startTime}</p>
            <p className="text-gray-600 mb-2">{shiftFromParam.endTime}</p>
            <p className="text-gray-600 mb-2">{shiftFromParam.description}</p>
            <p className="text-gray-600 mb-2">
              {shiftFromParam.requestedEmployees} REQUESTED EMPLOYEES
            </p>
            <p className="text-gray-600">{shiftFromParam.status}</p>
          </div>
          <div
            className={`mt-7 justify-center w-full ${
              !currentEmpShift ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Start Time"
                  value={StartTime}
                  onChange={(newValue) => setStartTime(newValue)}
                  disabled={!currentEmpShift}
                />
                <TimePicker
                  label="End Time"
                  value={EndTime}
                  onChange={(newValue) => setEndTime(newValue)}
                  disabled={!currentEmpShift}
                />
              </LocalizationProvider>
            </div>
            <button
              className={`bg-blue-500 text-white font-semibold py-3 px-6 w-full rounded-lg mt-4 
                ${
                  !currentEmpShift
                    ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }
              `}
              onClick={() => SaveShiftTimes()}
              disabled={!currentEmpShift}
            >
              Save Changes
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
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </>
  );
};
