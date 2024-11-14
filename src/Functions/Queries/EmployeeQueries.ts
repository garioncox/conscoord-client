import { useQuery } from "@tanstack/react-query";
import { getEmployeeByEmail } from "../EmployeeRequests";
import { useAuth0 } from "@auth0/auth0-react";
import { queryKeys } from "./QueryKeyFactory";

export const useLoggedInEmployee = () => {
  const { user, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: queryKeys.employees,
    queryFn: () => {
      return getEmployeeByEmail(user!.email!);
    },
    enabled: !!(isAuthenticated && user),
  });
};
