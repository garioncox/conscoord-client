import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addShift,
  archiveShift,
  editShift,
  getAllArchivedShifts,
  getAllShifts,
  getShiftById,
} from "../ShiftRequests";
import { queryClient } from "./QueryClient";
import { useAuth0 } from "@auth0/auth0-react";
import { addEmployeeShift, getClaimedShifts } from "../EmpShiftRequests";
import { ShiftDTO } from "@/Data/DTOInterfaces/ShiftDTO";
import { addProjectShift } from "../ProjectShiftRequests";
import { ProjectShiftDTO } from "@/Data/DTOInterfaces/ProjectShiftDTO";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import { useLoggedInEmployee } from "./EmployeeQueries";
import { queryKeys } from "./QueryKeyFactory";
import { Shift } from "@/Data/Interfaces/Shift";
import { useCustomToast } from "@/Components/Toast";

export const useAllShifts = () => {
  return useQuery({
    queryKey: queryKeys.shifts,
    queryFn: getAllShifts,
  });
};

export const useAllArchivedShifts = () => {
  return useQuery({
    queryKey: queryKeys.archivedShifts,
    queryFn: getAllArchivedShifts,
  });
};

export const useAllShiftsForLoggedInUser = () => {
  const { user, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: queryKeys.shiftsByUser(user!.email!),
    queryFn: () => {
      return getClaimedShifts(user!.email!);
    },
    enabled: !!(isAuthenticated && user),
  });
};

export const useShiftById = (shiftId: number) => {
  return useQuery({
    queryKey: queryKeys.shifts,
    queryFn: () => {
      return getShiftById(shiftId);
    },
  });
};

export const useAddShiftMutation = () => {
  return useMutation({
    mutationFn: async ({shift, projectId} : {shift: ShiftDTO, projectId: number}) => {
      const addedShiftId = await addShift(shift);
      const dto: ProjectShiftDTO = {
        shiftId: addedShiftId,
        projectId: projectId,
      };
      await addProjectShift(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shifts });
    },
    onError: () => {},
  });
};

export const useClaimShiftMutation = () => {
  const { createToast } = useCustomToast();

  const { data: employee } = useLoggedInEmployee();

  return useMutation({
    mutationFn: async (shiftId: number) => {
      const dto: EmployeeShiftDTO = {
        EmployeeId: employee!.id,
        ShiftId: shiftId,
      };
      await createToast(addEmployeeShift, dto, "Claiming shift...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employeeShifts,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.shifts,
      });
    },
  });
};

export const useEditShiftMutation = (shift: Shift) => {
  return useMutation({
    mutationFn: () => editShift(shift),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.shifts,
      });
    },
    onError: () => {},
  });
};

export const useArchiveShiftMutation = (shiftId: number) => {
  return useMutation({
    mutationFn: () => archiveShift(shiftId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.archivedShifts,
      });
    },
    onError: () => {},
  });
};
