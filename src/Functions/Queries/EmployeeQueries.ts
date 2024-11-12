import { useQuery } from "@tanstack/react-query";
import { getEmployeeByEmail } from "../EmployeeRequests";
import { useAuth0 } from "@auth0/auth0-react";

export const useLoggedInEmployee = () => {
  const { user, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["employee", user!.email],
    queryFn: () => {
      return getEmployeeByEmail(user!.email!);
    },
    enabled: !!(isAuthenticated && user),
  });
};
