import axios from "axios";
import { Project } from "../Data/Interfaces/Project";
import { ProjectDTO } from "../Data/DTOInterfaces/ProjectDTO";
import { useState } from "react";

export const useProjectRequests = () => {
  const [Projects, setProjects] = useState<Project[]>();

  const updateProject = async (project: Project) => {
    await axios.put(`/api/Project/edit/`, project);
  };

  const getCompanyProjects = async (empId: number): Promise<Project[]> => {
    const response = await axios.get(
      `/api/Project/getCompanyProjects/${empId}`
    );
    return response.data;
  };

  const getArchivedProjects = async (): Promise<Project[]> => {
    const response = await axios.get(`/api/Project/getAll/Archived`);
    return response.data;
  };

  return {
    Projects,
    setProjects,
    updateProject,
    getCompanyProjects,
    getArchivedProjects,
  };
};

export const addProject = async (id_token: string, project: ProjectDTO) => {
  await axios.post(`/api/Project/add`, project, {
    headers: {
      Authorization: `Bearer ${id_token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getAllProjects = async (): Promise<Project[]> => {
  const response = await axios.get(`/api/Project/getAll`);
  return response.data;
};

export const archiveProject = async (project: Project) => {
  await axios.put(`/api/Project/archive/`, project);
};
