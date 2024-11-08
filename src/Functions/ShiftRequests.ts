import axios from "axios";
import { Shift } from "../Data/Interfaces/Shift";
import { ShiftDTO } from "../Data/DTOInterfaces/ShiftDTO";

export const addShift = async (shift: ShiftDTO): Promise<number> => {
  const response = await axios.post(`/api/Shift/add`, shift);
  return response.data;
};

export const editShift = async (shift: Shift) => {
  await axios.put(`/api/Shift/edit/`, shift);
};

export const getAllShifts = async (): Promise<Shift[]> => {
  const response = await axios.get(`/api/Shift/getAll`);
  return response.data;
};

export const getShiftById = async (id: number): Promise<Shift> => {
  const response = await axios.get(`/api/Shift/get/${id}`);
  return response.data;
};

export const getAllArchivedShifts = async (): Promise<Shift[]> => {
  const response = await axios.get(`/api/Shift/getAll/archived`);
  return response.data;
};

export const archiveShift = async (shiftId: number) => {
  await axios.put(`/api/Shift/archive/${shiftId}`);
};
