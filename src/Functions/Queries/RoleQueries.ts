import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./QueryKeyFactory";
import { getAllRoles } from "../RoleRequests";

export const useAllRoles = () => {
    return useQuery({
        queryKey: queryKeys.roles,
        queryFn: getAllRoles,
      });
}