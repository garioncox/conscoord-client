import { useQuery } from "@tanstack/react-query";
import { useRoleRequests } from "./RoleRequests";
import { useAuth } from "react-oidc-context";

export const useRoleQuery = () => {
  const { isAuthenticated, user } = useAuth();
  const { getRoleFromEmail } = useRoleRequests();

  return useQuery({
    queryKey: ["role", user?.profile.email],
    queryFn: async () => {
      if (isAuthenticated && user?.profile.email) {
        return (await getRoleFromEmail(user?.profile.email)).rolename;
      }
      return "";
    },
  });
};
