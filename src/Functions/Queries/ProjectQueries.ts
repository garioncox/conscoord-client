import { useCustomToast } from "@/Components/Toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./QueryClient";
import { queryKeys } from "./QueryKeyFactory";
import {
  addProject,
  archiveProject,
  getAllProjects,
  useProjectRequests,
} from "../ProjectRequests";
import { Project } from "@/Data/Interfaces/Project";
import { ProjectDTO } from "@/Data/DTOInterfaces/ProjectDTO";
import { useEmployeeRequests } from "../EmployeeRequests";
import { useAuth } from "react-oidc-context";
import { toast } from "react-toastify";

export const useArchiveProjectMutation = () => {
  const { createToast } = useCustomToast();
  return useMutation({
    mutationFn: async (project: Project) => {
      await createToast(archiveProject, "Archiving Project...", project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.archivedProjects,
      });
    },
  });
};

export const useAddProjectMutation = () => {
  const { user } = useAuth();
  const {createToast } = useCustomToast();

  return useMutation({
    mutationFn: async ({ project }: { project: ProjectDTO }) => {
      await createToast(addProject, "Adding Project", user?.id_token ?? "", project) 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

export const useAllProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: getAllProjects,
  });
};

export const useAllProjectByLoggedInCompany = () => {
  const { user } = useAuth();
  const { getEmployeeByEmail } = useEmployeeRequests();
  const { getCompanyProjects } = useProjectRequests();

  return useQuery({
    queryKey: queryKeys.companyProjects,
    queryFn: async () => {
      if (user) {
        const currentUser = await getEmployeeByEmail(user?.profile.email ?? "");
        const projects = await getCompanyProjects(currentUser.id);

        if (projects) {
          return projects;
        }

        return [];
      }
    },
  });
};
