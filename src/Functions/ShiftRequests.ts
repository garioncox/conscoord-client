import axios from "axios";
import { Shift } from "../Data/Interfaces/Shift";
import { ShiftDTO } from "../Data/DTOInterfaces/ShiftDTO";

export const useShiftRequests = () => {
  const addShift = async (shift: ShiftDTO) => {
    await axios.post(`/api/Shift/add`, shift);
  };

  const editShift = async (id: number, shift: Shift) => {
    await axios.post(`/api/Shift/edit/${id}`, shift);
  };

  const getAllShifts = async (): Promise<Shift[]> => {
    const response = await axios.get(`/api/Shift/getAll`);
    return response.data;
  };

  const getAllArchivedShifts = async (): Promise<Shift[]> => {
    const response = await axios.get(`/api/Shift/getAll/archived`);
    return response.data;
  };

  const archiveShift = async (shiftId: number) => {
    await axios.post(`/api/Shift/archive/${shiftId}`);
  };

  return {
    addShift,
    editShift,
    getAllShifts,
    getAllArchivedShifts,
    archiveShift,
  };
};
