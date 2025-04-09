import { usePagination } from "@/Components/PaginatedTableHook";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { Shift } from "@/Data/Interfaces/Shift";
import {
  useEmpShiftsForLoggedInUser,
  useAllEmployeeShifts,
} from "@/Functions/Queries/EmployeeShiftQueries";
import { useClaimedShiftsForLoggedInUser } from "@/Functions/Queries/ShiftQueries";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useMyShiftsControl = () => {
  const { data: shifts, isLoading: isShiftsLoading } =
    useClaimedShiftsForLoggedInUser();
  const { data: employeeShifts, isLoading: isEmployeeShiftsLoading } =
    useEmpShiftsForLoggedInUser();
  const { data: allEmployeeShifts, isLoading: isAllEmployeeShiftsLoading } =
    useAllEmployeeShifts();
  const [showPastShifts, setShowPastShifts] = useState<boolean>(false);
  const navigate = useNavigate();

  const isLoading =
    isShiftsLoading || isEmployeeShiftsLoading || isAllEmployeeShiftsLoading;

  const shiftNeedsTimeEntered = (shift: Shift) => {
    const empShift = employeeShifts?.filter(
      (es: EmployeeShift) => es.shiftId == shift.id
    )[0];

    const hasEnteredTime = empShift?.clockInTime && empShift?.clockOutTime;
    const isFutureShift = new Date(shift.endTime) > new Date();
    if (hasEnteredTime || isFutureShift) {
      return false;
    }
    return true;
  };

  const shiftReportedCanceled = (shift: Shift) => {
    const empShift = employeeShifts?.filter(
      (es: EmployeeShift) => es.shiftId == shift.id
    )[0];

    return empShift?.reportedCanceled || empShift?.didNotWork;
  };

  const shiftIsResidual = (shift: Shift) => {
    const empShift = employeeShifts?.filter(
      (es: EmployeeShift) => es.shiftId == shift.id
    )[0];

    return empShift?.isResidual;
  };

  //after shiftNeedsTimeEntered or else it wouldn't exist to use yet
  const paginationControl = usePagination(
    shifts
      ?.filter(
        (x) =>
          showPastShifts ||
          new Date(x.endTime) >= new Date() ||
          shiftNeedsTimeEntered(x)
      )
      .sort((a) => (shiftNeedsTimeEntered(a) ? -1 : 1)) ?? []
  );

  const getNumEmployeesSignedUpForShift = (s: Shift) => {
    return (
      allEmployeeShifts?.filter((es: EmployeeShift) => es.shiftId == s.id)
        .length ?? 0
    );
  };

  const getEmpShiftCountColor = (s: Shift) => {
    const numSignedUp = getNumEmployeesSignedUpForShift(s);

    const percentageFilled = (numSignedUp / s.requestedEmployees) * 100;
    return percentageFilled <= 20
      ? "text-red-500"
      : percentageFilled <= 80
      ? "text-yellow-600"
      : "text-green-600";
  };

  const getShiftStatusColor = (s: Shift) => {
    if (shiftReportedCanceled(s)) {
      return "border-l-slate-200";
    }

    if (shiftNeedsTimeEntered(s)) {
      return "border-l-amber-300";
    }

    if (dayjs(s.endTime) < dayjs()) {
      return "border-l-green-500";
    }

    return "border-l-slate-200";
  };

  return {
    showPastShifts,
    setShowPastShifts,
    shiftNeedsTimeEntered,
    shiftIsResidual,
    paginationControl,
    isLoading,
    shifts,
    navigate,
    getEmpShiftCountColor,
    getNumEmployeesSignedUpForShift,
    getShiftStatusColor,
  };
};
