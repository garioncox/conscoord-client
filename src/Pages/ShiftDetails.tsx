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

const ShiftDetails = () => {
  const { id } = useParams();
  const {user} = useAuth0();
  const [shift, setShift] = useState<Shift>();
  const [currUser, setCurrUser] = useState<Employee>();
  const [currEmpShift, setCurrEmpShift] = useState<EmployeeShift>();
  const [allCurrEmpShift, setAllCurrEmpShift] = useState<EmployeeShift[]>();
  const [StartTime, setStartTime] = useState<Dayjs | null>(dayjs("2022-04-17T15:30"));
  const [EndTime, setEndTime] = useState<Dayjs | null>(dayjs("2022-04-17T15:30"));
  const [AdjustedStartTime, setAdjustedStartTime] = useState<Dayjs | null>(dayjs("2022-04-17T15:30"));
  const [AdjustedEndTime, setAdjustedEndTime] = useState<Dayjs | null>(dayjs("2022-04-17T15:30"));
  const { getEmployeeByEmail } = useEmployeeRequests();
  const { getAllEmployeeShifts } = useEmpShiftRequests()

  useEffect(() => {
    populateShift();
    getLoggedInUser();
    getCurrentEmployeeShift();
  }, []);

  async function populateShift() {
    setShift(await getShiftById(Number(id)));
  }

  async function getLoggedInUser() {
    if(user && user.email)
    setCurrUser(await getEmployeeByEmail(user.email));
  }

  async function getCurrentEmployeeShift() {
    setAllCurrEmpShift(await getAllEmployeeShifts())
    
    if(currUser)
    setCurrEmpShift(allCurrEmpShift?.find((es) => es.empId == currUser.id && es.shiftId == shift?.id))
  }

  function fixTimezoneStartDate(newValue: dayjs.Dayjs | null) {
    if(newValue){
    setStartTime(newValue);
    //use these to change the times in the database
    //time.get('hour') time.get('minute') time.get('hour')
    setAdjustedStartTime(newValue.add(-6, 'hour')) 
    }
  }

  function fixTimezoneEndDate(newValue: dayjs.Dayjs | null) {
    if(newValue){
    setEndTime(newValue);
    setAdjustedEndTime(newValue.add(-6, 'hour')) //use these to change the times in the database
    }
  }

  return (
    <>
      {shift ? (
        <div>
            <p>startTime {AdjustedStartTime?.toString()} endTime {AdjustedEndTime?.toString()}</p>
          <div className="border border-gray-300 rounded-lg p-6 max-w-md mx-auto shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Shift Details
            </h3>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Location:</span> {shift.location}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Start Time:</span> {shift.startTime}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">End Time:</span> {shift.endTime}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Description:</span>{" "}
              {shift.description}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Requested Employees:</span>{" "}
              {shift.requestedEmployees}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Status:</span> {shift.status}
            </p>
          </div>
          <div className="mt-5">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Start Time"
                value={StartTime}
                onChange={(newValue) => fixTimezoneStartDate(newValue)}
              />
              <TimePicker
                label="End Time"
                value={EndTime}
                onChange={(newValue) => fixTimezoneEndDate(newValue)}
              />
            </LocalizationProvider>{" "}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </>
  );
};

export default ShiftDetails;
