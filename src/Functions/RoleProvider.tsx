import { useQuery } from "@tanstack/react-query";
import { useCurrentEmployee } from "./Queries/EmployeeQueries";
import { useRoleRequests } from "./RoleRequests";
import { useAuth } from "react-oidc-context";

export const useRoleQuery = () => {
  const { data: currentEmployee, isLoading: isCurrentEmpLoading } =
    useCurrentEmployee();
  const roleRequests = useRoleRequests();
  const { user, isLoading: isUserLoading } = useAuth();

  return useQuery({
    queryKey: ["role", currentEmployee ? currentEmployee.email : ""],
    queryFn: async () => {
      if (!isCurrentEmpLoading && !isUserLoading && currentEmployee && user) {
        const role = await roleRequests.getRoleFromEmail(
          currentEmployee.email,
          user.id_token ?? ""
        );
        return role.rolename;
      }
      return null;
    },
    enabled:
      !!currentEmployee && !!user && !isCurrentEmpLoading && !isUserLoading,
  });
};
