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
import { addEmployeeShift, getClaimedShifts } from "../EmpShiftRequests";
import { ShiftDTO } from "@/Data/DTOInterfaces/ShiftDTO";
import { addProjectShift } from "../ProjectShiftRequests";
import { ProjectShiftDTO } from "@/Data/DTOInterfaces/ProjectShiftDTO";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import { useLoggedInEmployee } from "./EmployeeQueries";

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
    queryKey: ["shifts", user!.email],
    queryFn: () => {
      return getClaimedShifts(user!.email!);
    },
    enabled: !!(isAuthenticated && user),
  });
};

export const useShiftById = (shiftId: number) => {
  return useQuery({
    queryKey: ["shift", shiftId],
    queryFn: () => {
      return getShiftById(shiftId);
    },
  });
};

export const useAddShiftMutation = (shift: ShiftDTO, projectId: number) => {
  return useMutation({
    mutationFn: async () => {
      const addedShiftId = await addShift(shift);
      const dto: ProjectShiftDTO = {
        shiftId: addedShiftId,
        projectId: projectId,
      };
      await addProjectShift(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts", "shift"] });
      toast.success("Successfully added shift!");
    },
    onError: () => {
      toast.error("Operation failed for Adding Shift");
    },
  });
};

export const useClaimShiftMutation = () => {
  const { data: employee } = useLoggedInEmployee();

  return useMutation({
    mutationFn: async (shiftId: number) => {
      const dto: EmployeeShiftDTO = {
        EmployeeId: employee!.id,
        ShiftId: shiftId,
      };
      await addEmployeeShift(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts", "shift"] });
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
