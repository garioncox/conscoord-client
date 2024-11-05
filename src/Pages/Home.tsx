import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";

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
        if (error.status == 404) {
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
  }, [user]);

  return <p className="text-4xl">Welcome Home!</p>;
};
