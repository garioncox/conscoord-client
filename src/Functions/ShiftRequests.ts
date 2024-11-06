import axios from "axios";
import { Shift } from "../Data/Interfaces/Shift";
import { ShiftDTO } from "../Data/DTOInterfaces/ShiftDTO";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

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
    getAllShifts,
  };
};

const addShift = async (shift: ShiftDTO): Promise<number> => {
  const response = await axios.post(`/api/Shift/add`, shift);
  return response.data;
};

const editShift = async (shift: Shift) => {
  await axios.put(`/api/Shift/edit/`, shift);
};

const getAllArchivedShifts = async (): Promise<Shift[]> => {
  const response = await axios.get(`/api/Shift/getAll/archived`);
  return response.data;
};

const archiveShift = async (shiftId: number) => {
  await axios.put(`/api/Shift/archive/${shiftId}`);
};

const getAllShifts = async (): Promise<Shift[]> => {
  const response = await axios.get(`/api/Shift/getAll`);
  return response.data;
};

export const queryClient = new QueryClient();

export const useAllShifts = () => {
  return useQuery({
    queryKey: ["shifts"],
    queryFn: getAllShifts,
  });
};

export const useAllArchivedShifts = () => {
  return useQuery({
    queryKey: ["archivedShifts"],
    queryFn: getAllArchivedShifts,
  });
};

export const useAddShift = () => {
  return useMutation({
    mutationFn: addShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: () => {
      toast.error("Operation failed for Adding Shift");
    },
  });
};

export const useEditShift = () => {
  return useMutation({
    mutationFn: editShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: () => {
      toast.error("Operation failed for Editing Shift");
    },
  });
};

export const useArchiveShift = () => {
  return useMutation({
    mutationFn: archiveShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: () => {
      toast.error("Operation failed for Archiving Shift");
    },
  });
};
