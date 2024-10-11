import axios from "axios";
import { EmployeeShiftDTO } from "../Data/DTOInterfaces/EmployeeShiftDTO";

export const useEmpShiftRequests = () => {
  const addEmployeeShift = async (dto: EmployeeShiftDTO) => {
    await axios.post(`/api/EmployeeShift/add`, dto);
  };

  return {
    addEmployeeShift,
  };
};
