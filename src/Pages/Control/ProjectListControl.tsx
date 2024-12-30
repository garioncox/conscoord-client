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

  const [completedProjects, setCompletedShifts] = useState<Project[]>([]);
  const [archivedProjects, setArchivedShifts] = useState<Project[]>([]);
  const [regularShifts, setRegularShifts] = useState<Project[]>([]);
  const [sortedData, setSortedData] = useState<Project[] | null>([]);

  const [archivedSelected, setIsArchivedSelected] = useState<boolean>(false);
  const [completedSelected, setIsCompletedSelected] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      const cShifts = data.filter(
        (p: Project) => projectUtils.isComplete(p) && p.status === STATUS_ACTIVE
      );
      const aShifts = data.filter((p: Project) => p.status === STATUS_ARCHIVED);
      const rShifts = data.filter(
        (p: Project) =>
          !(projectUtils.isComplete(p) || p.status === STATUS_ARCHIVED)
      );

      // Preventing updating if we have no changes
      setCompletedShifts((prev) =>
        JSON.stringify(prev) === JSON.stringify(cShifts) ? prev : cShifts
      );
      setArchivedShifts((prev) =>
        JSON.stringify(prev) === JSON.stringify(aShifts) ? prev : aShifts
      );
      setRegularShifts((prev) =>
        JSON.stringify(prev) === JSON.stringify(rShifts) ? prev : rShifts
      );
    }
  }, [data, projectUtils]);

  useEffect(() => {
    if (data) {
      const newData = [
        ...regularShifts,
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
    regularShifts,
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
