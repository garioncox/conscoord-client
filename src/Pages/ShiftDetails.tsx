import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { useShiftById } from "@/Functions/Queries/ShiftQueries";
import { Spinner } from "@/Components/Spinner";
import { useEmpShiftsForLoggedInUser } from "@/Functions/Queries/EmployeeShiftQueries";
import {
  useEmployeesByShift,
  useLoggedInEmployee,
} from "@/Functions/Queries/EmployeeQueries";
import PSOView from "./ShiftDetails/PSOView";
import ClientView from "./ShiftDetails/ClientView";

export const ShiftDetails = () => {
  const { id } = useParams();

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
    if (id && !isClaimedShiftsLoading && !isShiftFromParamLoading) {
      const shift = claimedShifts?.find((cs) => cs.shiftId === Number(id));
      setCurrentEmpShift(shift);

      if (
        !shift ||
        (shift.clockInTime && shift.clockOutTime) ||
        new Date(shiftFromParam!.startTime) > new Date()
      ) {
        setIsFormDisabled(true);
      }
    }
  }, [
    claimedShifts,
    id,
    isClaimedShiftsLoading,
    isShiftFromParamLoading,
    shiftFromParam,
  ]);

  useEffect(() => {
    if (shiftFromParam && !isShiftFromParamLoading) {
      setStartTime(dayjs(new Date(shiftFromParam!.startTime).toISOString()));
      setEndTime(dayjs(new Date(shiftFromParam!.endTime).toISOString()));
    }
  }, [shiftFromParam, isShiftFromParamLoading]);

  if (isClaimedShiftsLoading || isShiftFromParamLoading) {
    return <Spinner />;
  }

  return (
    <>
      {shiftFromParam ? (
        <div>
          <div className="border space-y-2 border-gray-300 rounded-lg p-6 max-w-md mx-auto shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 ">
              Shift Details
            </h3>
            <p className="text-gray-600 ">{shiftFromParam.location}</p>
            <p className="text-gray-600 ">{shiftFromParam.startTime}</p>
            <p className="text-gray-600 ">{shiftFromParam.endTime}</p>
            <p className="text-gray-600 ">{shiftFromParam.description}</p>
            <p className="text-gray-600 ">
              {signedUpEmployees?.length}/{shiftFromParam.requestedEmployees}{" "}
              Shifts Filled
            </p>
          </div>

          {loggedInEmployee?.roleid !== 3 ? (
            <PSOView
              currentEmpShift={currentEmpShift}
              startTime={startTime}
              endTime={endTime}
              isFormDisabled={isFormDisabled}
              setStartTime={setStartTime}
              setEndTime={setEndTime}
            />
          ) : (
            <ClientView
              signedUpEmployees={signedUpEmployees}
              shift={shiftFromParam}
            />
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};
