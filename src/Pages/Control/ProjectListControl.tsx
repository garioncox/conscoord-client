import {
  Project,
  STATUS_ACTIVE,
  STATUS_ARCHIVED,
} from "@/Data/Interfaces/Project";
import { useAllProjects } from "@/Functions/Queries/ProjectQueries";
import { useState, useEffect } from "react";
import { useProjectUtils } from "../../Components/ProjectUtils";

export const useProjectListControl = () => {
  const { data, isLoading } = useAllProjects();
  const projectUtils = useProjectUtils();

  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [archivedProjects, setArchivedProjects] = useState<Project[]>([]);
  const [regularProjects, setRegularProjects] = useState<Project[]>([]);
  const [sortedData, setSortedData] = useState<Project[] | null>([]);

  const [archivedSelected, setIsArchivedSelected] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem("archivedSelected") || "false")
  );
  const [completedSelected, setIsCompletedSelected] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem("completedSelected") || "false")
  );

  // Sync variables with local storage
  useEffect(() => {
    localStorage.setItem("archivedSelected", JSON.stringify(archivedSelected));
  }, [archivedSelected]);

  useEffect(() => {
    localStorage.setItem(
      "completedSelected",
      JSON.stringify(completedSelected)
    );
  }, [completedSelected]);

  // Separate out projects by type on initial load
  useEffect(() => {
    if (data) {
      const cProjects = data.filter(
        (p: Project) => projectUtils.isComplete(p) && p.status === STATUS_ACTIVE
      );
      const aProjects = data.filter((p: Project) => p.status === STATUS_ARCHIVED);
      const rProjects = data.filter(
        (p: Project) =>
          !(projectUtils.isComplete(p) || p.status === STATUS_ARCHIVED)
      );

      // Preventing updating if we have no changes
      setCompletedProjects((prev) =>
        JSON.stringify(prev) === JSON.stringify(cProjects) ? prev : cProjects
      );
      setArchivedProjects((prev) =>
        JSON.stringify(prev) === JSON.stringify(aProjects) ? prev : aProjects
      );
      setRegularProjects((prev) =>
        JSON.stringify(prev) === JSON.stringify(rProjects) ? prev : rProjects
      );
    }
  }, [data, projectUtils]);

  // Update data when selections change
  useEffect(() => {
    if (data) {
      const newData = [
        ...regularProjects,
        ...(archivedSelected ? archivedProjects : []),
        ...(completedSelected ? completedProjects : []),
      ];

      setSortedData(() => newData);
    }
  }, [
    archivedProjects,
    archivedSelected,
    completedProjects,
    completedSelected,
    data,
    regularProjects,
  ]);

  return {
    isLoading,
    sortedData,
    setSortedData,
    archivedSelected,
    setIsArchivedSelected,
    completedSelected,
    setIsCompletedSelected,
  };
};
