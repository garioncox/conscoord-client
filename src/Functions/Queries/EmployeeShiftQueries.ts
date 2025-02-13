import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "./QueryKeyFactory";
import {
  getAllEmployeeShifts,
  getClaimedEmployeeShiftsByEmail,
  getEmpShiftHistory,
  useEmpShiftRequests,
} from "../EmpShiftRequests";
import { EmployeeShiftDTO } from "@/Data/DTOInterfaces/EmployeeShiftDTO";
import { queryClient } from "./QueryClient";
import { useAuth } from "react-oidc-context";
import { toast } from "react-toastify";

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
  const requests = useEmpShiftRequests();
  return useMutation({
    mutationFn: async (empShift: EmployeeShiftDTO) => {
      requests.updateEmpShift(empShift);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employeeShifts });
    },
    onError: () => {
      toast.error("An unexpected error occured.");
    },
  });
};
