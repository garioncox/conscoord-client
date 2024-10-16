import axios from "axios";
import { EmployeeShiftDTO } from "../Data/DTOInterfaces/EmployeeShiftDTO";
import { Shift } from "../Data/Interfaces/Shift";

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

  return {
    addEmployeeShift,
    getSignedUpShifts,
    deleteEmployeeShift,
  };
};
