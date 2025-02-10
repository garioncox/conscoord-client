import { FC, ReactNode } from "react";
import { useRoleForLoggedInUser } from "../../Functions/RoleProvider";
import Error from "../Error";
import { useAuth } from "react-oidc-context";
import { Spinner } from "../Spinner";

export const ADMIN_ROLE = "ADMIN";
export const PSO_ROLE = "PSO";
export const CLIENT_ROLE = "CLIENT";
export const NO_ROLE = "NOROLE";

const PermissionLock: FC<{
  roles: string[];
  children: ReactNode;
}> = ({ roles, children }) => {
  const { data: role, isLoading, isError } = useRoleForLoggedInUser();
  const { isLoading: isAuthLoading } = useAuth();

  if (isLoading || isAuthLoading) {
    <Spinner />;
  }

  if (isError) {
    return <Error />;
  }

  if ((role && roles.includes(role)) || role == ADMIN_ROLE) {
    return <>{children}</>;
  }

  return <p className="text-danger">401 Unauthorised</p>;
};

export default PermissionLock;
