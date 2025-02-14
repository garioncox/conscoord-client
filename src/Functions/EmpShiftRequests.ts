import axios from "axios";
import { Shift } from "../Data/Interfaces/Shift";
import { EmployeeShift } from "../Data/Interfaces/EmployeeShift";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import { EmployeeHistoryDTO } from "@/Data/DTOInterfaces/EmployeeHistoryDTO";
import { useAuth } from "react-oidc-context";

export const useEmpShiftRequests = () => {
  const { user } = useAuth();

  const addEmployeeShift = async (dto: EmployeeShiftDTO) => {
    await axios.post(`/api/EmployeeShift/add`, dto, {
      headers: {
        Authorization: `Bearer ${user?.id_token ?? ""}`,
        "Content-Type": "application/json",
      },
    });
  };

  const getSignedUpShifts = async (email: string): Promise<Shift[]> => {
    const response = await axios.get(`/api/EmployeeShift/get/${email}`);
    return response.data;
  };

  const deleteEmployeeShift = async (id: number) => {
    await axios.delete(`/api/EmployeeShift/delete/${id}`);
  };

  const updateEmpShift = async (empShift: EmployeeShiftDTO) => {
    await axios.put(`/api/EmployeeShift/edit`, empShift, {
      headers: {
        Authorization: `Bearer ${user?.id_token ?? ""}`,
        "Content-Type": "application/json",
      },
    });
  };

  return {
    addEmployeeShift,
    getSignedUpShifts,
    deleteEmployeeShift,
    updateEmpShift,
  };
};

export const getAllEmployeeShifts = async (): Promise<EmployeeShift[]> => {
  const response = await axios.get(`/api/EmployeeShift/getall`);
  return response.data;
};

export const getClaimedEmployeeShiftsByEmail = async (
  email: string
): Promise<EmployeeShift[]> => {
  const response = await axios.get(`/api/EmployeeShift/get/${email}`);
  return response.data;
};

export const getEmpShiftHistory = async (
  email: string
): Promise<EmployeeHistoryDTO[]> => {
  const response = await axios.get(`/api/EmployeeShift/get/history/${email}`);
  return response.data;
};
