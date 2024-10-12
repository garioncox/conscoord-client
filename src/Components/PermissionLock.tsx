import { FC, ReactNode } from "react";
import { useRoleProvider } from "../Functions/RoleProvider";

export const ADMIN_ROLE = "ADMIN";
export const PSO_ROLE = "PSO";
export const CLIENT_ROLE = "CLIENT";

const PermissionLock: FC<{
  role: string;
  children: ReactNode;
}> = ({ role, children }) => {
  const { useRoleQuery } = useRoleProvider();

  const roleQuery = useRoleQuery();

  if (!roleQuery) {
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>;
  }

  if (roleQuery.data && roleQuery.data === role) {
    return <div>{children}</div>;
  }

  return <p className="text-danger">401 Unauthorised</p>;
};

export default PermissionLock;
