import axios from "axios";
import { EmployeeShiftDTO } from "../Data/DTOInterfaces/EmployeeShiftDTO";
import { Shift } from "../Data/Interfaces/Shift";
import { EmployeeShift } from "../Data/Interfaces/EmployeeShift";

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
  }

  return {
    addEmployeeShift,
    getSignedUpShifts,
    deleteEmployeeShift,
    getAllEmployeeShifts
  };
};
