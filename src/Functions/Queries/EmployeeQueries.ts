import { useQuery } from "@tanstack/react-query";
import { getAllEmployees, getEmployeeByEmail } from "../EmployeeRequests";
import { useAuth0 } from "@auth0/auth0-react";
import { queryKeys } from "./QueryKeyFactory";

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

export const useAllEmployees = () => {
  return useQuery({
    queryKey: queryKeys.employees,
    queryFn: getAllEmployees,
  });
};
