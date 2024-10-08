import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { EmployeeDTO } from "../Data/DTOInterfaces/EmployeeDTOInterface";
import { createNewUser, getUserByEmail } from "../Functions/AddUser";

const Home = () => {
  const { user } = useAuth0();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await getUserByEmail(user?.email);
        if (!loggedInUser) {
          if (user && user.name && user.email) {
            const newUser: EmployeeDTO = {
              name: user.name,
              email: user.email,
              phonenumber: user?.phone_number ? user.phone_number : ""
            }
            createNewUser(newUser)
          }
          else {
            console.log("user could not be created");
          }
        }
      } catch (error) {
        console.error("Error fetching user by email:", error);
      }
    }

    fetchUser();
  }, [user]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <h1>Welcome Home!</h1>
    </div>
  );
};

export default Home;
