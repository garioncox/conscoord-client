import axios from "axios";
import { Project } from "../Data/Interfaces/Project";
import { ProjectDTO } from "../Data/DTOInterfaces/ProjectDTO";
import { useState } from "react";

export const useProjectRequests = () => {
  const [Projects, setProjects] = useState<Project[]>()

  const archiveProject = async (project: Project) => {
    await axios.put(`/api/Project/archive/`, project);
  };

  const addProject = async (project: ProjectDTO) => {
    await axios.post(`/api/Project/add`, project);
  };

  const updateProject = async (project: Project) => {
    await axios.put(`/api/Project/edit/`, project);
  };

  const getAllProjects = async (): Promise<Project[]> => {
    const response = await axios.get(`/api/Project/getAll`);
    return response.data;
  };

  return {
    Projects,
    setProjects,
    getAllProjects,
    addProject,
    updateProject,
    archiveProject,
  };
};
