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
import { useRoleForLoggedInUser } from "@/Functions/RoleProvider";
import { Spinner } from "@/Components/Spinner";
import Error from "@/Components/Error";
import { useCurrentEmployee } from "@/Functions/Queries/EmployeeQueries";
import { useAuth } from "react-oidc-context";

export const Home = () => {
  const {
    data: role,
    isLoading: isRoleLoading,
    isError,
  } = useRoleForLoggedInUser();
  const { isLoading: isAuthLoading } = useAuth();
  const { isLoading: isEmpLoading } = useCurrentEmployee();

  if (isRoleLoading || isEmpLoading || isAuthLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <Error />;
  }


  if (!role) {
    return <LandingPage />;
  }

  return (
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
  );
};
