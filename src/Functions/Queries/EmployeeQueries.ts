import { useQuery } from "@tanstack/react-query";
import { getAllEmployees, getEmployeeByEmail } from "../EmployeeRequests";
import { useAuth0 } from "@auth0/auth0-react";
import { queryKeys } from "./QueryKeyFactory";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { EmployeeShift } from "@/Data/Interfaces/EmployeeShift";
import { getAllEmployeeShifts } from "../EmpShiftRequests";

export const useLoggedInEmployee = () => {
  const { user, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: queryKeys.loggedInEmployees,
    queryFn: () => {
      return getEmployeeByEmail(user!.email!);
    },
    enabled: !!(isAuthenticated && user),
  });
};

export const useEmployeesByShift = (shiftId: number) => {
  return useQuery({
    queryKey: [queryKeys.employeesByShift, shiftId],
    queryFn: async() => {
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
