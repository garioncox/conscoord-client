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
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { queryClient } from "./QueryClient";
import { useCustomToast } from "@/Components/Toast";
import { useAuth } from "react-oidc-context";
import { getAllEmployeeShiftsByShiftId } from "../EmpShiftRequests";

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
  return useMutation({
    mutationFn: addEmployee,
  });
};

export const useEmployeesByShift = (shiftId: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [queryKeys.employeesByShift, shiftId],
    queryFn: async () => {
      return await getAllEmployeeShiftsByShiftId(user?.id_token ?? "", shiftId);
    },
  });
};

export const useAllEmployees = () => {
  return useQuery({
    queryKey: queryKeys.employees,
    queryFn: getAllEmployees,
  });
};

export const useEmployeeById = (id: number) => {
  return useQuery({
    queryKey: [queryKeys.employeeId, id],
    queryFn: async () => {
      return await getEmployeesByShiftId(id);
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
