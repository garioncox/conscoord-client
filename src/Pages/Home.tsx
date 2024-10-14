import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import PermissionLock, {
  CLIENT_ROLE,
  PSO_ROLE,
} from "../Components/PermissionLock";

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

  return (
    <PermissionLock roles={[PSO_ROLE, CLIENT_ROLE]}>
      <div className="d-flex justify-content-center align-items-center">
        <h1>Welcome Home!</h1>
      </div>
    </PermissionLock>
  );
};
