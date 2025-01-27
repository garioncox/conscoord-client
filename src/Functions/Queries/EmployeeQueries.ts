import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllEmployees,
  getEmployeeByEmail,
  getEmployeesByShiftId,
  useEmployeeRequests,
} from "../EmployeeRequests";
import { queryKeys } from "./QueryKeyFactory";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { getAllEmployeeShifts } from "../EmpShiftRequests";
import { useAuth } from "react-oidc-context";

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
  return useQuery({
    queryKey: [queryKeys.employeesByShift, shiftId],
    queryFn: async () => {
      const Employees: Employee[] = await getAllEmployees();
      const EmpShifts: EmployeeShift[] = await getAllEmployeeShifts();
      const filteredEmpShifts = EmpShifts.filter((es) => es.shiftId == shiftId);
      const signedUpEmployees = Employees.filter((employee) =>
        filteredEmpShifts.some((fes) => fes.empId == employee.id)
      );
      return signedUpEmployees;
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
