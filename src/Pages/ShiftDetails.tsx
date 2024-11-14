import { Shift } from "@/Data/Interfaces/Shift";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getShiftById } from "@/Functions/ShiftRequests";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { useAuth0 } from "@auth0/auth0-react";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { useEmployeeRequests } from "@/Functions/EmployeeRequests";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { useEmpShiftRequests } from "@/Functions/EmpShiftRequests";
import { EditEmployeeShiftDTO } from "@/Data/DTOInterfaces/EditEmployeeShiftDTO";

const ShiftDetails = () => {
  const { id } = useParams();
  const { user } = useAuth0();
  const [shift, setShift] = useState<Shift>();
  const [currUser, setCurrUser] = useState<Employee>();
  const [currEmpShift, setCurrEmpShift] = useState<EmployeeShift>();
  const [allCurrEmpShift, setAllCurrEmpShift] = useState<EmployeeShift[]>();
  const [StartTime, setStartTime] = useState<Dayjs | null>(
    dayjs("2022-04-17T15:30")
  );
  const [EndTime, setEndTime] = useState<Dayjs | null>(
    dayjs("2022-04-17T15:30")
  );

  const { getEmployeeByEmail } = useEmployeeRequests();
  const { getAllEmployeeShifts, updateEmpShiftTimes } = useEmpShiftRequests();

  useEffect(() => {
    populateShift();
    getLoggedInUser();
    getCurrentEmployeeShift();
    console.log("EmpShift is " + currEmpShift);
  }, []);

  useEffect(() => {
    if (currUser && shift && allCurrEmpShift) {
      setCurrEmpShift(
        allCurrEmpShift.find(
          (es) => es.empId === currUser.id && es.shiftId === shift.id
        )
      );
    }
  }, [currUser, shift, allCurrEmpShift]);

  async function populateShift() {
    setShift(await getShiftById(Number(id)));
  }

  async function getLoggedInUser() {
    if (user && user.email) setCurrUser(await getEmployeeByEmail(user.email));
  }

  async function getCurrentEmployeeShift() {
    setAllCurrEmpShift(await getAllEmployeeShifts());

    if (currUser && shift) {
      setCurrEmpShift(
        allCurrEmpShift?.find(
          (es) => es.empId == currUser.id && es.shiftId == shift.id
        )
      );
    }
  }

  function SaveShiftTimes(): void {
    if (currEmpShift && StartTime && EndTime) {
      const newEmpShift: EditEmployeeShiftDTO = {
        id: currEmpShift.id,
        clockInTime: `${StartTime.get("hour") + ":" + StartTime.get("minute")}`,
        clockOutTime: `${EndTime.get("hour") + ":" + EndTime.get("minute")}`,
        employeeId: currEmpShift.empId,
        shiftId: currEmpShift.shiftId,
      };
      updateEmpShiftTimes(newEmpShift);
    } else {
      console.log("conditions were not met");
    }
  }

  return (
    <>
      {shift ? (
        <div>
          <div className="border border-gray-300 rounded-lg p-6 max-w-md mx-auto shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 ">
              Shift Details
            </h3>
            <p className="text-gray-600 mb-2">
               {shift.location}
            </p>
            <p className="text-gray-600 mb-2">
               {shift.startTime}
            </p>
            <p className="text-gray-600 mb-2">
              {shift.endTime}
            </p>
            <p className="text-gray-600 mb-2">
              
              {shift.description}
            </p>
            <p className="text-gray-600 mb-2">
              
              {shift.requestedEmployees} REQUESTED EMPLOYEES
            </p>
            <p className="text-gray-600">
               {shift.status}
            </p>
          </div>
          <div
            className={`mt-7 justify-center w-full ${
              !currEmpShift ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Start Time"
                value={StartTime}
                onChange={(newValue) => setStartTime(newValue)}
                disabled={!currEmpShift}
              />
              <TimePicker
                label="End Time"
                value={EndTime}
                onChange={(newValue) => setEndTime(newValue)}
                disabled={!currEmpShift}
              />
            </LocalizationProvider>
            </div>
            <button
              className={`bg-blue-500 text-white font-semibold py-3 px-6 w-full rounded-lg mt-4 
                ${
                  !currEmpShift
                    ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }
              `}
              onClick={() => SaveShiftTimes()}
              disabled={!currEmpShift}
            >
              Save Changes
            </button>
            {!currEmpShift ? (
              <p className="mt-4 text-red-500 font-semibold text-center">
                You have not signed up for this shift
              </p>
            ) : 
              currEmpShift.clockInTime && currEmpShift.clockOutTime ? (
                <div className="mt-4 text-center">
                  <p className="text-green-600 font-semibold">
                    Start time now set at: {currEmpShift.clockInTime}
                  </p>
                  <p className="text-green-600 font-semibold">
                    End time now set at: {currEmpShift.clockOutTime}
                  </p>
                </div>
              ) : null
            }
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </>
  );
};

export default ShiftDetails;
