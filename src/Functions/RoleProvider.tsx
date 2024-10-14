import { useQuery } from "@tanstack/react-query";
import { useApiRequests } from "./ApiRequests";
import { useAuth0 } from "@auth0/auth0-react";

export const useRoleProvider = () => {
  const { isAuthenticated, user } = useAuth0();
  const { getRoleFromEmail } = useApiRequests();

  const useRoleQuery = () => {
    return useQuery({
      queryKey: ["role", user?.email || ""],
      queryFn: async () => {
        if (isAuthenticated && user?.email) {
          return (await getRoleFromEmail(user.email)).rolename;
        }
        return "";
      },
    });
  };

  return { useRoleQuery };
};
