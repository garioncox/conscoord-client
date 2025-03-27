import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "./QueryKeyFactory";
import {
  addProjectShift,
  getAllProjectShifts,
  getNumProjectShiftsForProject,
} from "../ProjectShiftRequests";
import { getShiftsByProject } from "../ShiftRequests";
import { ProjectShiftDTO } from "@/Data/DTOInterfaces/ProjectShiftDTO";
import { useAuth } from "react-oidc-context";
import { queryClient } from "./QueryClient";
import { useCustomToast } from "@/Components/Toast";

export const useNumProjectShiftForProject = (projectId: number) => {
  return useQuery({
    queryKey: queryKeys.numProjectShifts,
    queryFn: () => {
      return getNumProjectShiftsForProject(projectId);
    },
  });
};

export const useAddProjectShift = () => {
  const { user } = useAuth();
  const {createToast} = useCustomToast();
  return useMutation({
    mutationFn: async ({ project }: { project: ProjectShiftDTO }) => {
      await createToast(addProjectShift, "Adding Project Shift" , user?.id_token ?? "", project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
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
