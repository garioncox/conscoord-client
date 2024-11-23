import { useCustomToast } from "@/Components/Toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "./QueryClient";
import { queryKeys } from "./QueryKeyFactory";
import { archiveProject } from "../ProjectRequests";
import { Project } from "@/Data/Interfaces/Project";

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
