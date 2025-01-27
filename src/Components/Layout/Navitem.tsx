import { FC } from "react";
import { Link } from "react-router-dom";
import { useRoleQuery } from "../../Functions/RoleProvider";
import { ADMIN_ROLE } from "../Auth/PermissionLock";
import { useAuth } from "react-oidc-context";

const NavItem: FC<{
  to: string;
  label: string;
  roles: string[];
}> = ({ to, label, roles }) => {
  const { data } = useRoleQuery();
  const { isLoading: authLoading } = useAuth();

  if (data && (roles.includes(data) || data === ADMIN_ROLE) && !authLoading) {
    return (
      <div className="text-lg px-3 flex items-center mt-4 lg:mt-0 text-secondary hover:text-tertiary">
        <Link to={to}>{label}</Link>
      </div>
    );
  }
};

export default NavItem;
