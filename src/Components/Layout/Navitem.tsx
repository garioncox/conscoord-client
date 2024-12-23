import { FC } from "react";
import { Link } from "react-router-dom";
import { useRoleQuery } from "../../Functions/RoleProvider";
import { ADMIN_ROLE } from "../Auth/PermissionLock";

const NavItem: FC<{
  to: string;
  label: string;
  roles: string[];
}> = ({ to, label, roles }) => {
  const { data } = useRoleQuery();

  if (data && (roles.includes(data) || data === ADMIN_ROLE)) {
    return (
      <div className="text-lg px-3 flex items-center mt-4 lg:mt-0 text-secondary hover:text-tertiary">
        <Link to={to}>{label}</Link>
      </div>
    );
  }
};

export default NavItem;
