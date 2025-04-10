import { Project } from "@/Data/Interfaces/Project";
import { useAllEmployees } from "@/Functions/Queries/EmployeeQueries";
import { useAllProjectShifts } from "@/Functions/Queries/ProjectShiftQueries";
import { useAllShifts } from "@/Functions/Queries/ShiftQueries";
import { useShiftsFulfilledUtils } from "./ShiftsFulfilledHook";

export const useProjectUtils = () => {
  const {
    data: employees,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useAllEmployees();
  const {
    data: projectShifts,
    isLoading: projectShiftsLoading,
    isError: projectShiftsError,
  } = useAllProjectShifts();
  const {
    data: shifts,
    isLoading: shiftsLoading,
    isError: shiftsError,
  } = useAllShifts();

  const shiftUtils = useShiftsFulfilledUtils();

  const isComplete = (p: Project) => {
    return new Date(p.endDate).toISOString() < new Date().toISOString();
  };

  const getShiftsAvailable = (p: Project, isPSO: boolean) => {
    if (isComplete(p)) {
      return 0;
    }

    //get all project shifts for the project
    const filteredProjectShifts = projectShifts!.filter(
      (ps) => ps.projectId === p.id
    );

    const filteredShifts = shifts!.filter((shift) =>
      filteredProjectShifts.some((ps) => ps.shiftId === shift.id)
    );

    if (isPSO) {
      const shiftsAvailable = filteredShifts.filter(
        (s) =>
          shiftUtils.shiftsAvailable(s) - shiftUtils.shiftsClaimed(s) > 0 &&
          new Date(s.endTime) >= new Date()
      ).length;
      return shiftsAvailable;
    } else {
      return filteredShifts.length;
    }
  };

  const getContactInfo = (p: Project) => {
    return employees?.find((e) => e.id === p.contactinfo);
  };

  const getTimeLength = (p: Project) => {
    return Math.floor(
      (new Date(p.endDate as string).getTime() -
        new Date(p.startDate as string).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const getDateRangeString = (p: Project) => {
    return `${new Date(p.startDate).toLocaleDateString()} - ${new Date(
      p.endDate
    ).toLocaleDateString()}`;
  };

  const isLoading = employeesLoading || projectShiftsLoading || shiftsLoading;
  const isError = employeesError || projectShiftsError || shiftsError;

  return {
    isComplete,
    getShiftsAvailable,
    getContactInfo,
    getTimeLength,
    getDateRangeString,
    isLoading,
    isError,
  };
};
