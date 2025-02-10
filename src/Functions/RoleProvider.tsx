import { useQuery } from "@tanstack/react-query";
import { getRoleForLoggedInUser } from "./RoleRequests";
import { useAuth } from "react-oidc-context";
import { queryKeys } from "./Queries/QueryKeyFactory";

export const useRoleForLoggedInUser = () => {
  const { user, isLoading } = useAuth();

  return useQuery({
    queryKey: [queryKeys.roles, user?.profile.email ?? ""],
    queryFn: async () => {
      const role = await getRoleForLoggedInUser(user?.id_token ?? "");
      return role.rolename;
    },
    enabled: !!user && !isLoading,
  });
};
