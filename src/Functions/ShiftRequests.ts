import axios from "axios";
import { Shift } from "../Data/Interfaces/Shift";
import { ShiftDTO } from "../Data/DTOInterfaces/ShiftDTO";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useShiftRequests = () => {
  const queryClient = useQueryClient();

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
  };

  const getAllArchivedShifts = async (): Promise<Shift[]> => {
    const response = await axios.get(`/api/Shift/getAll/archived`);
    return response.data;
  };

  const archiveShift = async (shiftId: number) => {
    await axios.put(`/api/Shift/archive/${shiftId}`);
  };


  //////////////////////////////////TANSTACK///////////////////////////////////////
  const shiftsQuery = useQuery<Shift[]>({
    queryKey: ["Shifts"],
    queryFn: getAllShifts,
  });

  const usePopulatedShifts = () => {
    return useQuery({
      queryKey: ["populatedShifts"],
      queryFn: () => {
        if (shiftsQuery.data) {
          return shiftsQuery.data;
        }
      },
    });
  };

  const archivedShiftsQuery = useQuery<Shift[]>({
    queryKey: ["archivedShifts"],
    queryFn: getAllArchivedShifts,
  });

  const useShiftByIdQuery = (id: number) => {
    return useQuery<Shift>({
      queryKey: ["Shift", id],
      queryFn: () => getShiftById(id),
      enabled: !!id,
    });
  };

  const shiftAddMutation = useMutation({
    mutationFn: addShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Shifts"] });
    },
  });

  const shiftEditMutation = useMutation({
    mutationFn: editShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Shifts"] });
    },
  });

  const shiftArchiveMutation = useMutation({
    mutationFn: archiveShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Shifts"] });
    },
  });

  return {
    shiftAddMutation,
    shiftEditMutation,
    useShiftByIdQuery,
    archivedShiftsQuery,
    shiftArchiveMutation,
    shiftsQuery,
    usePopulatedShifts,
  };
};
