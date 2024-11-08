import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addShift,
  archiveShift,
  editShift,
  getAllArchivedShifts,
  getAllShifts,
} from "../ShiftRequests";
import { toast } from "react-toastify";
import { queryClient } from "./QueryClient";

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

export const useAddShiftMutation = () => {
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

export const useEditShiftMutation = () => {
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

export const useArchiveShiftMutation = () => {
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
