import { useQuery } from "@tanstack/react-query";
import { getRoleForLoggedInUser } from "./RoleRequests";
import { useAuth } from "react-oidc-context";

export const useRoleForLoggedInUser = () => {
  const { user, isLoading } = useAuth();

  return useQuery({
    queryKey: ["role", user?.profile.email ?? ""],
    queryFn: async () => {
      const role = await getRoleForLoggedInUser(user?.id_token ?? "");
      return role.rolename;
    },
    enabled: !!user && !isLoading,
  });
};
