import { useEffect } from "react";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { AxiosError } from "axios";
import { useAuth } from "react-oidc-context";
import { useCurrentEmployee } from "@/Functions/Queries/EmployeeQueries";

export const Home = () => {
  // const { getCurrentUser, addEmployee } = useEmployeeRequests();
  const {data, isLoading, isError} = useCurrentEmployee();

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!data || isLoading || isError) {
        console.log("Pending...");
        return;
      }

      console.log(data);
      return;

      // try {
      //   await currentEmployee.getCurrentUser();
      // } catch (error) {
      //   // console.log(error)
      //   return;
      //   const axiosError = error as AxiosError;
      //   if (axiosError.response && axiosError.response.status === 404) {
      //     console.log("User is not in database...");
      //     console.log("Adding user");

      //     addEmployee({
      //       name: user?.profile.name ?? "",
      //       email: user?.profile.email ?? "",
      //       phonenumber: user?.profile.phone_number ?? "",
      //     });
      //   }

      //   console.error("Error fetching user by email:", error);
      // }
    };

    fetchUser();
  }, [data, isError, isLoading, user]);

  return <p className="text-4xl">Welcome Home!</p>;
};
