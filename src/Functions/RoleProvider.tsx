import { useQuery } from "@tanstack/react-query";
import { useCurrentEmployee } from "./Queries/EmployeeQueries";
import { useRoleRequests } from "./RoleRequests";

export const useRoleQuery = () => {
  const { data: currentEmployee, isLoading, isError } = useCurrentEmployee();
  const roleRequests = useRoleRequests();

  return useQuery({
    queryKey: ["role", currentEmployee ? currentEmployee.email : ""],
    queryFn: async () => {
      if (!isLoading && !isError && currentEmployee) {
        const role = await roleRequests.getRoleFromEmail(currentEmployee.email);
        return role.rolename;
      }
      return "";
    },
  });
};
