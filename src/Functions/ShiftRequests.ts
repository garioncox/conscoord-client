import axios from "axios";
import { Shift } from "../Data/Interfaces/Shift";
import { ShiftDTO } from "../Data/DTOInterfaces/ShiftDTO";

export const useShiftRequests = () => {
  const addShift = async (shift: ShiftDTO): Promise<number> => {
    const response = await axios.post(`/api/Shift/add`, shift);
    return response.data;
  };

  const editShift = async (shift: Shift) => {
    await axios.put(`/api/Shift/edit/`, shift);
  };

  const getAllShifts = async (): Promise<Shift[]> => {
    const response = await axios.get(`/api/Shift/getAll`);
    return response.data;
  };

  const getShiftById = async (id: number): Promise<Shift> => {
    const response = await axios.get(`/api/Shift/get/${id}`);
    return response.data;
  }

  const getAllArchivedShifts = async (): Promise<Shift[]> => {
    const response = await axios.get(`/api/Shift/getAll/archived`);
    return response.data;
  };

  const archiveShift = async (shiftId: number) => {
    await axios.put(`/api/Shift/archive/${shiftId}`);
  };

  return {
    addShift,
    editShift,
    getShiftById,
    getAllShifts,
    getAllArchivedShifts,
    archiveShift,
  };
};
