import axios from "axios";
import { Project } from "../Data/Interfaces/Project";
import { ProjectDTO } from "../Data/DTOInterfaces/ProjectDTO";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { useEmployeeRequests } from "./EmployeeRequests";
import { queryKeys } from "./Queries/QueryKeyFactory";

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

export const addProject = async (project: ProjectDTO) => {
  await axios.post(`/api/Project/add`, project);
};

export const getAllProjects = async (): Promise<Project[]> => {
  const response = await axios.get(`/api/Project/getAll`);
  return response.data;
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

export const archiveProject = async (project: Project) => {
  await axios.put(`/api/Project/archive/`, project);
};
