import { FC, ReactNode } from "react";
import { useRoleQuery } from "../../Functions/RoleProvider";

const PermissionComponentLock: FC<{
  roles: string[];
  children: ReactNode;
}> = ({ roles, children }) => {
  const roleQuery = useRoleQuery();

  if (roleQuery.data && roles.includes(roleQuery.data)) {
    return <>{children}</>;
  }
};

export default PermissionComponentLock;
