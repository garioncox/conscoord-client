import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "./QueryKeyFactory";
import {
  deleteEmpShift,
  getAllEmployeeShifts,
  getClaimedEmployeeShiftsByEmail,
  getEmpShiftHistory,
  useEmpShiftRequests,
} from "../EmpShiftRequests";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import { queryClient } from "./QueryClient";
import { useAuth } from "react-oidc-context";
import { useCustomToast } from "@/Components/Toast";

export const useEmpShiftHistoryForEmail = (email: string) => {
  return useQuery({
    queryKey: [queryKeys.employeeHistory, email],
    queryFn: () => getEmpShiftHistory(email),
    enabled: !!email,
  });
};

export const useAllEmployeeShifts = () => {
  return useQuery({
    queryKey: queryKeys.allEmployeeShifts,
    queryFn: getAllEmployeeShifts,
  });
};

export const useEmpShiftsForLoggedInUser = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.employeeShifts,
    queryFn: () => {
      return getClaimedEmployeeShiftsByEmail(user?.profile.email ?? "");
    },
    enabled: !!(isAuthenticated && user),
  });
};

export const useEmpShiftMutation = () => {
  const { createToast } = useCustomToast();
  const requests = useEmpShiftRequests();
  return useMutation({
    mutationFn: async (empShift: EmployeeShiftDTO) => {
      await createToast(requests.updateEmpShift, "Updating shift...", empShift);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeShifts });
    },
  });
};

export const useDeleteEmpShiftMutation = () => {
  const { createToast } = useCustomToast();

  return useMutation({
    mutationFn: async ({ shiftId, employeeId }: { shiftId: number; employeeId: number }) => {
      await createToast(() => deleteEmpShift(shiftId, employeeId), "Removing from shift...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.employeeHistory] });
    },
  });
};
