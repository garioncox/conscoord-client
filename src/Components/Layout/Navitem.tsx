import { FC } from "react";
import { Link } from "react-router-dom";
import { useRoleProvider } from "../../Functions/RoleProvider";
import { ADMIN_ROLE } from "../Auth/PermissionLock";

const NavItem: FC<{
  to: string;
  label: string;
  roles: string[];
}> = ({ to, label, roles }) => {
  const { useRoleQuery } = useRoleProvider();
  const { data } = useRoleQuery();

  if (data && (roles.includes(data) || data === ADMIN_ROLE)) {
    return (
      <li className="nav-item">
        <Link className="nav-link" to={to}>
          {label}
        </Link>
      </li>
    );
  }
};

export default NavItem;
