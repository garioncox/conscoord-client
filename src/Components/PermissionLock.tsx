import { FC, ReactNode } from "react";
import { useRoleQuery } from "../Functions/RoleProvider";

export const ADMIN_ROLE = "ADMIN";
export const PSO_ROLE = "PSO";
export const CLIENT_ROLE = "CLIENT";

const PermissionLock: FC<{
  roles: string[];
  children: ReactNode;
}> = ({ roles, children }) => {
  const roleQuery = useRoleQuery();

  if (!roleQuery) {
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>;
  }

  if (
    (roleQuery.data && roles.includes(roleQuery.data)) ||
    roleQuery.data == ADMIN_ROLE
  ) {
    return <div>{children}</div>;
  }

  return <p className="text-danger">401 Unauthorised</p>;
};

export default PermissionLock;
