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
import {
  useEmployeesByShift,
  useLoggedInEmployee,
} from "@/Functions/Queries/EmployeeQueries";

export const ShiftDetails = () => {
  const { id } = useParams();

  const empShiftMutation = useEmpShiftMutation();
  const { data: loggedInEmployee } = useLoggedInEmployee();
  const { data: claimedShifts, isLoading: isClaimedShiftsLoading } =
    useEmpShiftsForLoggedInUser();
  const { data: shiftFromParam, isLoading: isShiftFromParamLoading } =
    useShiftById(Number(id));
  const { data: signedUpEmployees } = useEmployeesByShift(Number(id));

  const [currentEmpShift, setCurrentEmpShift] = useState<
    EmployeeShift | undefined
  >(undefined);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (id && !isClaimedShiftsLoading) {
      setCurrentEmpShift(
        claimedShifts?.find((cs) => cs.shiftId === Number(id))
      );
      if (
        !currentEmpShift ||
        (currentEmpShift?.clockInTime && currentEmpShift?.clockOutTime)
      ) {
        setIsFormDisabled(true);
      }
    }
  }, [
    claimedShifts,
    currentEmpShift,
    currentEmpShift?.clockInTime,
    currentEmpShift?.clockOutTime,
    id,
    isClaimedShiftsLoading,
  ]);

  useEffect(() => {
    if (shiftFromParam && !isShiftFromParamLoading) {
      setStartTime(dayjs(new Date(shiftFromParam!.startTime).toISOString()));
      setEndTime(dayjs(new Date(shiftFromParam!.endTime).toISOString()));
    }
  }, [shiftFromParam, isShiftFromParamLoading]);

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
              {signedUpEmployees?.length}/{shiftFromParam.requestedEmployees}{" "}
              Shifts Filled
            </p>
          </div>
          {loggedInEmployee?.roleid != 3 ? (
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
                }
              `}
                onClick={() => SaveShiftTimes()}
                disabled={isFormDisabled}
              >
                Submit Time
              </button>
              {!currentEmpShift ? (
                <p className="mt-4 text-red-500 font-semibold text-center">
                  You have not signed up for this shift
                </p>
              ) : currentEmpShift.clockInTime &&
                currentEmpShift.clockOutTime ? (
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
          ) : (
            <div>
              <div className="mt-10 mb-5 text-4xl font-bold">
                Signed Up Employees:
              </div>

              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Email
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Phone Number
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {signedUpEmployees?.map((s, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="border border-gray-300 px-4 py-2">
                          {s.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {s.email}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {s.phonenumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </>
  );
};
