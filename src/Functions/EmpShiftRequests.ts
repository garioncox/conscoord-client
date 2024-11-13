import axios from "axios";
import { EmployeeShiftDTO } from "../Data/DTOInterfaces/EmployeeShiftDTO";
import { Shift } from "../Data/Interfaces/Shift";
import { EmployeeShift } from "../Data/Interfaces/EmployeeShift";
import { EditEmployeeShiftDTO } from "@/Data/DTOInterfaces/EditEmployeeShiftDTO";

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

  const getAllEmployeeShifts = async (): Promise<EmployeeShift[]> => {
    const response = await axios.get(`/api/EmployeeShift/getall`);
    return response.data;
  };

  const updateEmpShiftTimes = async (empShift : EditEmployeeShiftDTO) => {
    await axios.put(`/api/EmployeeShift/edit`, empShift);
  }

  return {
    addEmployeeShift,
    getSignedUpShifts,
    deleteEmployeeShift,
    getAllEmployeeShifts,
    updateEmpShiftTimes
  };
};

export const getShiftsSignedUpFor = async (email: string): Promise<Shift[]> => {
  const response = await axios.get(`/api/EmployeeShift/get/${email}`);
  return response.data;
};
