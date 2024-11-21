import axios from "axios";
import { ProjectShiftDTO } from "../Data/DTOInterfaces/ProjectShiftDTO";
import ProjectShift from "../Data/Interfaces/ProjectShift";
import { useState } from "react";

export const useProjectShiftRequests = () => {
  const [ProjectShifts, setProjectShifts] = useState<ProjectShift[]>();

  const addProjectShift = async (dto: ProjectShiftDTO) => {
    await axios.post(`/api/ProjectShift/add`, dto);
  };

  const deleteProjectShift = async (projectShiftID: number) => {
    await axios.delete(`/api/ProjectShift/delete/${projectShiftID}`);
  };

  return {
    addProjectShift,
    deleteProjectShift,
    ProjectShifts,
    setProjectShifts,
  };
};

export const getAllProjectShifts = async (): Promise<ProjectShift[]> => {
  const response = await axios.get(`/api/ProjectShift/getAll`);
  return response.data;
};

export const addProjectShift = async (dto: ProjectShiftDTO) => {
  await axios.post(`/api/ProjectShift/add`, dto);
};

export const getNumProjectShiftsForProject = async (projectId: number) => {
  const response = await axios.get(
    `/api/ProjectShift/getShiftNumPerProject/${projectId}`
  );
  return response.data;
};
