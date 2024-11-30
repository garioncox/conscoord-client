import { Shift } from "@/Data/Interfaces/Shift";
import { useAllEmployeeShifts } from "@/Functions/Queries/EmployeeShiftQueries";

export const useShiftsFulfilledUtils = () => {
  const { data: employeeShifts } = useAllEmployeeShifts();

  const shiftsClaimed = (shift: Shift) => {
    return employeeShifts
      ? employeeShifts!.filter((es) => es.shiftId == shift.id).length
      : 0;
  };

  const shiftsAvailable = (shift: Shift) => {
    return shift.requestedEmployees;
  };

  const shiftFraction = (shift: Shift) => {
    return shiftsClaimed(shift) / shiftsAvailable(shift);
  };

  const shiftFractionString = (shift: Shift) => {
    return `${shiftsClaimed(shift)} / ${shiftsAvailable(shift)}`;
  };
  const shiftFractionStyles = (shift: Shift) => {
    const percentage = (shiftsClaimed(shift) / shiftsAvailable(shift)) * 100;
    return percentage <= 20
      ? "text-red-500 font-semibold"
      : percentage <= 80
      ? "text-yellow-600 font-semibold"
      : "text-green-600 font-semibold";
  };

  return {
    shiftsClaimed,
    shiftsAvailable,
    shiftFraction,
    shiftFractionString,
    shiftFractionStyles,
  };
};
