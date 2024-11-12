import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addShift,
  archiveShift,
  editShift,
  getAllArchivedShifts,
  getAllShifts,
  getShiftById,
} from "../ShiftRequests";
import { toast } from "react-toastify";
import { queryClient } from "./QueryClient";
import { useAuth0 } from "@auth0/auth0-react";
import { getShiftsSignedUpFor } from "../EmpShiftRequests";

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

export const useAllShiftsForLoggedInUser = () => {
  const { user, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["shifts"],
    queryFn: () => {
      return getShiftsSignedUpFor(user!.email!);
    },
    enabled: !!(isAuthenticated && user),
  });
};

export const useGetShiftById = (shiftId: number) => {
  return useQuery({
    queryKey: ["shift", shiftId],
    queryFn: () => {
      return getShiftById(shiftId);
    },
  });
};

export const useAddShiftMutation = () => {
  return useMutation({
    mutationFn: addShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success("Successfully added shift!");
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
      toast.success("Successfully edited shift!");
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
      toast.success("Successfully archived shift!");
    },
    onError: () => {
      toast.error("Operation failed for Archiving Shift");
    },
  });
};
