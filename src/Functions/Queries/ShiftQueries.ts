import { useMutation, useQuery } from "@tanstack/react-query";
import {
  archiveShift,
  editShift,
  getAllArchivedShifts,
  getAllShifts,
  getClaimedShifts,
  getShiftById,
  getShiftDatesWithError,
} from "../ShiftRequests";
import { queryClient } from "./QueryClient";
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
    queryKey: [queryKeys.shiftErrorDates, companyId],
    queryFn: async () => {
      if (!companyId) {
        return;
      }
      const data = await getShiftDatesWithError(
        user?.id_token ?? "",
        companyId
      );
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

export const useClaimShiftMutation = () => {
  const { data: employee } = useLoggedInEmployee();
  const requests = useEmpShiftRequests();
  const { createToast } = useCustomToast();

  return useMutation({
    mutationFn: async (shiftId: number) => {
      const dto: EmployeeShiftDTO = {
        id: null,
        clockInTime: null,
        clockOutTime: null,
        didNotWork: false,
        empId: employee!.id,
        hasbeeninvoiced: false,
        reportedCanceled: false,
        shiftId: shiftId,
      };
      await createToast(requests.addEmployeeShift, "Claiming shift...", dto);
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
      await createToast(editShift, "Editing shift...", shift),
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
    mutationFn: async ({
      shiftId,
      makeToast = true,
    }: {
      shiftId: number;
      makeToast: boolean;
    }) => {
      if (makeToast) {
        await createToast(archiveShift, "Archiving shift...", shiftId);
      } else {
        await archiveShift(shiftId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.archivedShifts,
      });
    },
  });
};
