import PermissionComponentLock from "@/Components/Auth/PermissionComponentLock";
import PSOQuickLink from "./QuickLinkPages/PSOQuickLink";
import { ConstructionManagerQuickLink } from "./QuickLinkPages/ConstructionManagerQuickLink";
import AdminQuickLinks from "./QuickLinkPages/AdminQuickLinks";
import {
  ADMIN_ROLE,
  CLIENT_ROLE,
  PSO_ROLE,
} from "@/Components/Auth/PermissionLock";
import LandingPage from "./QuickLinkPages/LandingPage";
import { useRoleQuery } from "@/Functions/RoleProvider";
import { Spinner } from "@/Components/Spinner";
import Error from "@/Components/Error";
import { useEffect } from "react";
import { useCurrentEmployee } from "@/Functions/Queries/EmployeeQueries";
import { useAuth } from "react-oidc-context";

export const Home = () => {
  const { data, isLoading, isError } = useRoleQuery();
  const { isLoading: authLoading } = useAuth();
  const { data: user, isLoading: isEmpLoading } = useCurrentEmployee();
  useEffect(() => {
    console.log("data: ", data);
    console.log("user: ", user);
  }, [data, isLoading, user]);

  if (isLoading || authLoading || isEmpLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <Spinner />
        <p>This may take a moment...</p>
      </div>
    );
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      {!data ? (
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
