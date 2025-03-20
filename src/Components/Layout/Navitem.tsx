import { FC } from "react";
import { Link } from "react-router-dom";
import { useRoleForLoggedInUser } from "../../Functions/RoleProvider";
import { useAuth } from "react-oidc-context";

const NavItem: FC<{
  to: string;
  label: string;
  roles: string[];
  onClick?: (() => void) | null;
}> = ({ to, label, roles, onClick = undefined }) => {
  const { data: role, isLoading: isRoleLoading } = useRoleForLoggedInUser();
  const { isLoading: authLoading } = useAuth();

  if (role && roles.includes(role) && !authLoading && !isRoleLoading) {
    return (
      <div className="text-lg px-3 flex items-center mt-4 lg:mt-0 text-secondary hover:text-tertiary">
        <Link to={to} onClick={onClick ?? undefined}>
          {label}
        </Link>
      </div>
    );
  }
};

export default NavItem;
