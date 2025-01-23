import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useEmployeeRequests } from "../Functions/EmployeeRequests";
import { AxiosError } from "axios";
import PermissionComponentLock from "@/Components/Auth/PermissionComponentLock";
import PSOQuickLink from "./QuickLinkPages/PSOQuickLink";
import { ConstructionManagerQuickLink } from "./QuickLinkPages/ConstructionManagerQuickLink";
import AdminQuickLinks from "./QuickLinkPages/AdminQuickLinks";
import { useRoleQuery } from "@/Functions/RoleProvider";
import {
  ADMIN_ROLE,
  CLIENT_ROLE,
  PSO_ROLE,
} from "@/Components/Auth/PermissionLock";
import LandingPage from "./QuickLinkPages/LandingPage";

export const Home = () => {
  const { addEmployee, getEmployeeByEmail } = useEmployeeRequests();
  const roleQuery = useRoleQuery();
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

    <>
      {!roleQuery.data ? (
        <LandingPage />
      ) : (
        <div>
          <PermissionComponentLock roles={[PSO_ROLE]}>
            <PSOQuickLink />
          </PermissionComponentLock>
          <PermissionComponentLock roles={[CLIENT_ROLE]}>
            <ConstructionManagerQuickLink />
          </PermissionComponentLock>
          <PermissionComponentLock roles={[ADMIN_ROLE]}>
            <AdminQuickLinks />
          </PermissionComponentLock>
        </div>
      )}
    </>
  );
};
