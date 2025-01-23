import { FC, ReactNode } from "react";
import { useRoleQuery } from "../../Functions/RoleProvider";
import { Spinner } from "../Spinner";

export const ADMIN_ROLE = "ADMIN";
export const PSO_ROLE = "PSO";
export const CLIENT_ROLE = "CLIENT";
export const NO_ROLE = "NOROLE";

const PermissionLock: FC<{
  roles: string[];
  children: ReactNode;
}> = ({ roles, children }) => {
  const roleQuery = useRoleQuery();

  if (!roleQuery) {
    return <Spinner />;
  }

  if (
    (roleQuery.data && roles.includes(roleQuery.data)) ||
    roleQuery.data == ADMIN_ROLE
  ) {
    return <>{children}</>;
  }

  return <p className="text-danger">401 Unauthorised</p>;
};

export default PermissionLock;
