import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { AxiosError } from "axios";
import { UserInfo } from "@/Components/UserInfo";

export const Home = () => {
  const { addEmployee, getEmployeeByEmail } = useEmployeeRequests();

  const { user } = useAuth0();

  useEffect(() => {
    const fetchUser = async () => {
      if (user === undefined) {
        return;
      }

      try {
        await getEmployeeByEmail(user.email!);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          console.log("User is not in database...");
          console.log("Adding user");

          addEmployee({
            name: user.name!,
            email: user.email!,
            phonenumber: user.phone_number ?? "",
          });
        }

        console.error("Error fetching user by email:", error);
      }
    };

    fetchUser();
  }, [addEmployee, getEmployeeByEmail, user]);

  return (
    <div>
      <p className="text-4xl">Welcome Home!</p>
      {<UserInfo />}
    </div>
  )

};
