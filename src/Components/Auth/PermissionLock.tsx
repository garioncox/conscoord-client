import { FC, ReactNode } from "react";
import { useRoleQuery } from "../../Functions/RoleProvider";
import { Spinner } from "../Spinner";
import Error from "../Error";

export const ADMIN_ROLE = "ADMIN";
export const PSO_ROLE = "PSO";
export const CLIENT_ROLE = "CLIENT";

const PermissionLock: FC<{
  roles: string[];
  children: ReactNode;
}> = ({ roles, children }) => {
  const {data, isLoading, isError} = useRoleQuery();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <Error />
  }

  if ((data && roles.includes(data)) || data == ADMIN_ROLE) {
    return <>{children}</>;
  }

  return <p className="text-danger">401 Unauthorised</p>;
};

export default PermissionLock;
