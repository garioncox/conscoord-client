import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./QueryKeyFactory";
import { getAllProjectShiftsForProject } from "../ProjectShiftRequests";

export const useProjectShiftForProject = (projectId: number) => {
  return useQuery({
    queryKey: queryKeys.projectShifts,
    queryFn: () => {
      return getAllProjectShiftsForProject(projectId);
    },
  });
};
