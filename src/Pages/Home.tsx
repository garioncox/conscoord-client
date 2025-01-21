import { useEffect } from "react";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { AxiosError } from "axios";
import { useAuth } from "react-oidc-context";

export const Home = () => {
  const { getCurrentUser, addEmployee } = useEmployeeRequests();

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (user === undefined || !isAuthenticated) {
        return;
      }

      console.log(isAuthenticated);

      try {
        await getCurrentUser();
      } catch (error) {
        // console.log(error)
        return;
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          console.log("User is not in database...");
          console.log("Adding user");

          addEmployee({
            name: user?.profile.name ?? "",
            email: user?.profile.email ?? "",
            phonenumber: user?.profile.phone_number ?? "",
          });
        }

        console.error("Error fetching user by email:", error);
      }
    };

    fetchUser();
  }, [addEmployee, getCurrentUser, user]);

  return <p className="text-4xl">Welcome Home!</p>;
};
