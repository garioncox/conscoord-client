import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "./QueryKeyFactory";
import {
  getAllEmployeeShifts,
  getClaimedEmployeeShiftsByEmail,
  updateEmpShift,
} from "../EmpShiftRequests";
import { useCustomToast } from "@/Components/Toast";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import { queryClient } from "./QueryClient";
import { useAuth } from "react-oidc-context";

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
  return useMutation({
    mutationFn: async (empShift: EmployeeShiftDTO) => {
      await createToast(updateEmpShift, empShift, "Updating shift...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeShifts });
    },
  });
};
