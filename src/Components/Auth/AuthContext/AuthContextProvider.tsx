import { authContext } from "./AuthContext";
import { FC, ReactNode, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Employee } from "@/Data/Interfaces/EmployeeInterface";
import { getEmployeeByEmail } from "@/Functions/EmployeeRequests";

export const AuthContextProvier: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee>();
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      console.log(user);
      if (isAuthenticated && user) {
        setCurrentUser(await getEmployeeByEmail(user.email ?? ""));
      }
    };

    fetchCurrentUser();
  }, [isAuthenticated, user]);

  return (
    <authContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
