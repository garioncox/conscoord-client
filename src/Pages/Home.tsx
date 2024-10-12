import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useApiRequests } from "../Functions/ApiRequests";
import PermissionLock, { ADMIN_ROLE } from "../Components/PermissionLock";

export const Home = () => {
  const { addEmployee, getUserByEmail } = useApiRequests();

  const { user } = useAuth0();

  useEffect(() => {
    const fetchUser = async () => {
      if (user === undefined) {
        return;
      }

      try {
        await getUserByEmail(user.email!);
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
    <PermissionLock role={ADMIN_ROLE}>
      <div className="d-flex justify-content-center align-items-center">
        <h1>Welcome Home!</h1>
      </div>
    </PermissionLock>
  );
};
