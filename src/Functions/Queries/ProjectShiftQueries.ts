import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./QueryKeyFactory";
import {
  getAllProjectShifts,
  getNumProjectShiftsForProject,
} from "../ProjectShiftRequests";
import { getShiftsByProject } from "../ShiftRequests";

export const useNumProjectShiftForProject = (projectId: number) => {
  return useQuery({
    queryKey: queryKeys.numProjectShifts,
    queryFn: () => {
      return getNumProjectShiftsForProject(projectId);
    },
  });
};

export const useAllProjectShifts = () => {
  return useQuery({
    queryKey: queryKeys.projectShifts,
    queryFn: getAllProjectShifts,
  });
};

export const useProjectShiftsByProjectId = (projectId: number) => {
  return useQuery({
    queryKey: [queryKeys.shiftsByProject, projectId],
    queryFn: () => {
      return getShiftsByProject(projectId);
    },
  });
};
