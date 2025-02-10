import { FC, ReactNode } from "react";
import { useRoleForLoggedInUser } from "../../Functions/RoleProvider";

const PermissionComponentLock: FC<{
  roles: string[];
  children: ReactNode;
}> = ({ roles, children }) => {
  const { data: role, isLoading } = useRoleForLoggedInUser();

  if (role && roles.includes(role) && !isLoading) {
    return <>{children}</>;
  }
};

export default PermissionComponentLock;
