import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { addEmployee, getUserByEmail } from "../Functions/ApiRequests";

export const Home = () => {
  const { user } = useAuth0();

  useEffect(() => {
    const fetchUser = async () => {
      if (user === undefined) {
        return;
      }

      try {
        const loggedInUser = await getUserByEmail(user.email!);
        if (!loggedInUser) {
          addEmployee({
            name: user.name!,
            email: user.email!,
            phonenumber: user.phone_number ?? "",
          });
        } else {
          console.log("user could not be created");
        }
      } catch (error) {
        console.error("Error fetching user by email:", error);
      }
    };

    fetchUser();
  }, [user]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <h1>Welcome Home!</h1>
    </div>
  );
};
