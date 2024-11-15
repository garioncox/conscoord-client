import axios from "axios";
import { Shift } from "../Data/Interfaces/Shift";
import { EmployeeShift } from "../Data/Interfaces/EmployeeShift";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";

export const useEmpShiftRequests = () => {
  const addEmployeeShift = async (dto: EmployeeShiftDTO) => {
    await axios.post(`/api/EmployeeShift/add`, dto);
  };

  const getSignedUpShifts = async (email: string): Promise<Shift[]> => {
    const response = await axios.get(`/api/EmployeeShift/get/${email}`);
    return response.data;
  };

  const deleteEmployeeShift = async (id: number) => {
    await axios.delete(`/api/EmployeeShift/delete/${id}`);
  };

  const updateEmpShiftTimes = async (empShift: EmployeeShiftDTO) => {
    await axios.put(`/api/EmployeeShift/edit`, empShift);
  };

  return {
    addEmployeeShift,
    getSignedUpShifts,
    deleteEmployeeShift,
    getAllEmployeeShifts,
    updateEmpShiftTimes,
  };
};

export const getAllEmployeeShifts = async (): Promise<EmployeeShift[]> => {
  const response = await axios.get(`/api/EmployeeShift/getall`);
  return response.data;
};

export const addEmployeeShift = async (dto: EmployeeShiftDTO) => {
  await axios.post(`/api/EmployeeShift/add`, dto);
};

export const getClaimedEmployeeShiftsByEmail = async (
  email: string
): Promise<EmployeeShift[]> => {
  const response = await axios.get(`/api/EmployeeShift/get/${email}`);
  return response.data;
};

export const updateEmpShift = async (empShift: EmployeeShiftDTO) => {
  await axios.put(`/api/EmployeeShift/edit`, empShift);
};
