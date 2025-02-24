import { useMutation, useQuery } from "@tanstack/react-query";
import {
  editEmployee,
  getAllEmployees,
  getEmployeeByEmail,
  getEmployeesByShiftId,
  useEmployeeRequests,
} from "../EmployeeRequests";
import { queryKeys } from "./QueryKeyFactory";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { queryClient } from "./QueryClient";
import { useCustomToast } from "@/Components/Toast";
import { useAuth } from "react-oidc-context";
import { EmployeeDTO } from "@/Data/DTOInterfaces/EmployeeDTOInterface";

export const useLoggedInEmployee = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.loggedInEmployee,
    queryFn: () => {
      return getEmployeeByEmail(user?.profile.email ?? "");
    },
    enabled: !!(isAuthenticated && user),
  });
};

export const useAddEmployeeMutation = () => {
  const { addEmployee } = useEmployeeRequests();
  const { createToast } = useCustomToast();

  return useMutation({
    mutationFn: async (emp: EmployeeDTO) => {
      await createToast(addEmployee, emp, "Adding Employee...");
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });
    },
  });
};

export const useAllEmployees = () => {
  return useQuery({
    queryKey: queryKeys.employees,
    queryFn: getAllEmployees,
  });
};

export const useEmployeesByShiftId = (shiftId: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [queryKeys.employeeId, shiftId],
    queryFn: async () => {
      return await getEmployeesByShiftId(user?.id_token ?? "", shiftId);
    },
  });
};

export const useEditEmployeeMutation = () => {
  const { createToast } = useCustomToast();

  return useMutation({
    mutationFn: async (e: Employee) => {
      await createToast(editEmployee, e, "Editing Project");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });
    },
  });
};

export const useCurrentEmployee = () => {
  const employeeRequests = useEmployeeRequests();
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.loggedInEmployee,
    queryFn: async () => {
      const emp = await employeeRequests.getCurrentUser(user?.id_token ?? "");
      return emp;
    },
    enabled: !!(isAuthenticated && user),
  });
};
