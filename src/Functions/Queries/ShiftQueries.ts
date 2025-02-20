import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addShift,
  archiveShift,
  editShift,
  getAllArchivedShifts,
  getAllShifts,
  getClaimedShifts,
  getShiftById,
  getShiftDatesWithError,
} from "../ShiftRequests";
import { queryClient } from "./QueryClient";
import { ShiftDTO } from "@/Data/DTOInterfaces/ShiftDTO";
import { addProjectShift } from "../ProjectShiftRequests";
import { ProjectShiftDTO } from "@/Data/DTOInterfaces/ProjectShiftDTO";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import { useLoggedInEmployee } from "./EmployeeQueries";
import { queryKeys } from "./QueryKeyFactory";
import { Shift } from "@/Data/Interfaces/Shift";
import { useCustomToast } from "@/Components/Toast";
import { useAuth } from "react-oidc-context";
import { useEmpShiftRequests } from "../EmpShiftRequests";

export const useShiftDatesWithError = (companyId: number | undefined) => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.shiftErrorDates,
    queryFn: async () => {
      if (!companyId) {
        return;
      }
      const data = await getShiftDatesWithError(
        user?.id_token ?? "",
        companyId
      );
      console.log(data);
      return data;
    },
    enabled: !!(isAuthenticated && user && companyId),
  });
};

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
  const { data: employee } = useLoggedInEmployee();
  const requests = useEmpShiftRequests();
  const { createToast } = useCustomToast();

  return useMutation({
    mutationFn: async (shiftId: number) => {
      const dto: EmployeeShiftDTO = {
        id: null,
        clockInTime: "",
        clockOutTime: "",
        didnotwork: false,
        empId: employee!.id,
        hasbeeninvoiced: false,
        reportedcanceled: false,
        shiftId: shiftId,
      };
      await createToast(requests.addEmployeeShift, dto, "Claiming shift...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeShifts });
      queryClient.invalidateQueries({ queryKey: queryKeys.shifts });
      queryClient.invalidateQueries({ queryKey: queryKeys.allEmployeeShifts });
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
