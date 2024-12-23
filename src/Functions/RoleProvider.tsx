import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { useRoleRequests } from "./RoleRequests";

export const useRoleQuery = () => {
  const { isAuthenticated, user } = useAuth0();
  const { getRoleFromEmail } = useRoleRequests();

  return useQuery({
    queryKey: ["role", user?.email],
    queryFn: async () => {
      if (isAuthenticated && user?.email) {
        return (await getRoleFromEmail(user.email)).rolename;
      }
      return "";
    },
  });
};
