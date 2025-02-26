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
import { toast } from "react-toastify";
import { queryClient } from "./QueryClient";

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
  return useMutation({
    mutationFn: async ({ project }: { project: ProjectShiftDTO }) => {
      addProjectShift(user?.id_token ?? "", project);
    },
    onSuccess: () => {
      toast.success("Shift created successfully");
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
