import { FC, ReactNode } from "react";
import { useRoleQuery } from "../../Functions/RoleProvider";

const PermissionComponentLock: FC<{
  roles: string[];
  children: ReactNode;
}> = ({ roles, children }) => {
  const { data } = useRoleQuery();

  if (data && roles.includes(data)) {
    return <>{children}</>;
  }
};

export default PermissionComponentLock;
