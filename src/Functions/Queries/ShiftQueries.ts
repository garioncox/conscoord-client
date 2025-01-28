import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addShift,
  archiveShift,
  editShift,
  getAllArchivedShifts,
  getAllShifts,
  getClaimedShifts,
  getShiftById,
} from "../ShiftRequests";
import { queryClient } from "./QueryClient";
import { addEmployeeShift } from "../EmpShiftRequests";
import { ShiftDTO } from "@/Data/DTOInterfaces/ShiftDTO";
import { addProjectShift } from "../ProjectShiftRequests";
import { ProjectShiftDTO } from "@/Data/DTOInterfaces/ProjectShiftDTO";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import { useLoggedInEmployee } from "./EmployeeQueries";
import { queryKeys } from "./QueryKeyFactory";
import { Shift } from "@/Data/Interfaces/Shift";
import { useCustomToast } from "@/Components/Toast";
import { useAuth } from "react-oidc-context";

export const useAllShifts = () => {
  return useQuery({
    queryKey: [queryKeys.shifts],
    queryFn: getAllShifts,
  });
};

export const useAllArchivedShifts = () => {
  return useQuery({
    queryKey: queryKeys.archivedShifts,
    queryFn: getAllArchivedShifts,
  });
};

export const useClaimedShiftsForLoggedInUser = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.shiftsByUser(user?.profile.email ?? ""),
    queryFn: () => {
      return getClaimedShifts(user?.profile.email ?? "");
    },
    enabled: !!(isAuthenticated && user),
  });
};

export const useShiftById = (shiftId: number) => {
  return useQuery({
    queryKey: [queryKeys.shiftsById(shiftId), queryKeys.shifts, shiftId],
    queryFn: () => {
      return getShiftById(shiftId);
    },
  });
};

export const useAddShiftMutation = (projectId: number) => {
  const { createToast } = useCustomToast();

  return useMutation({
    mutationFn: async ({
      shift,
      projectId,
    }: {
      shift: ShiftDTO;
      projectId: number;
    }) => {
      const addedShiftId = await addShift(shift);
      const dto: ProjectShiftDTO = {
        shiftId: addedShiftId,
        projectId: projectId,
      };
      await createToast(addProjectShift, dto, "Creating shift...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.shiftsByProject, projectId],
      });
    },
  });
};

export const useClaimShiftMutation = () => {
  const { createToast } = useCustomToast();
  const { data: employee } = useLoggedInEmployee();

  return useMutation({
    mutationFn: async (shiftId: number) => {
      const dto: EmployeeShiftDTO = {
        id: null,
        clockInTime: "",
        clockOutTime: "",
        employeeId: employee!.id,
        shiftId: shiftId,
      };
      await createToast(addEmployeeShift, dto, "Claiming shift...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeShifts }); // Invalidate shifts for the logged-in employee
      queryClient.invalidateQueries({ queryKey: queryKeys.shifts }); // Optionally invalidate all shifts
      queryClient.invalidateQueries({ queryKey: queryKeys.allEmployeeShifts }); // Optionally invalidate all shifts
    },
  });
};

export const useEditShiftMutation = (shift: Shift) => {
  const { createToast } = useCustomToast();
  return useMutation({
    mutationFn: async () =>
      await createToast(editShift, shift, "Editing shift..."),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.shifts,
      });
    },
  });
};

export const useArchiveShiftMutation = () => {
  const { createToast } = useCustomToast();
  return useMutation({
    mutationFn: async (shiftId: number) => {
      await createToast(archiveShift, shiftId, "Archiving shift...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.archivedShifts,
      });
    },
  });
};
