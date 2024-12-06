import { useCustomToast } from "@/Components/Toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./QueryClient";
import { queryKeys } from "./QueryKeyFactory";
import { addProject, archiveProject, getAllProjects, useProjectRequests } from "../ProjectRequests";
import { Project } from "@/Data/Interfaces/Project";
import { ProjectDTO } from "@/Data/DTOInterfaces/ProjectDTO";
import { useAuth0 } from "@auth0/auth0-react";
import { useEmployeeRequests } from "../EmployeeRequests";

export const useArchiveProjectMutation = () => {
  const { createToast } = useCustomToast();
  return useMutation({
    mutationFn: async (project: Project) => {
      await createToast(archiveProject, project, "Archiving Project...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.archivedProjects,
      });
    },
  });
};

export const useAddProjectMutation = () => {
  const { createToast } = useCustomToast();

  return useMutation({
    mutationFn: async ({
      project,
    }: {
      project: ProjectDTO;
    }) => {
      await createToast(addProject, project, "Creating shift...");
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
  const { user } = useAuth0();
  const { getEmployeeByEmail } = useEmployeeRequests();
  const { getCompanyProjects } = useProjectRequests();

  return useQuery({
    queryKey: ["companyProjects"],
    queryFn: async () => {
      if (user) {
        const currentUser = await getEmployeeByEmail(user.email || "");
        const projects = await getCompanyProjects(currentUser.id);

        if (projects) {
          return projects;
        }

        return [];
      }
    },
  });
};