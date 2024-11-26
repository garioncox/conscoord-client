import { useCustomToast } from "@/Components/Toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "./QueryClient";
import { queryKeys } from "./QueryKeyFactory";
import { addProject, archiveProject } from "../ProjectRequests";
import { Project } from "@/Data/Interfaces/Project";
import { ProjectDTO } from "@/Data/DTOInterfaces/ProjectDTO";

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
