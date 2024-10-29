import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../Auth/Login";
import LogoutButton from "../Auth/Logout";
import { Link } from "react-router-dom";
import { ADMIN_ROLE, CLIENT_ROLE, PSO_ROLE } from "../Auth/PermissionLock";
import NavItem from "./Navitem";

const Navbar = () => {
  const { user } = useAuth0();

  return (
    <nav className="bg-primary p-8 flex grow">
      <div className="">
        <Link className="text-4xl" to="/">
          Home
        </Link>
      </div>
      <div className="ms-20 flex" id="navbarNav">
        {/* PSO Items */}
        <NavItem
          to={"/shift/view/officer"}
          label={"Officer Shifts"}
          roles={[PSO_ROLE]}
        />
        <NavItem
          to={"/shift/view/shifts"}
          label={"My Shifts"}
          roles={[PSO_ROLE]}
        />

        {/* Client Items */}
        <NavItem
          to={"/project/view"}
          label={"Projects"}
          roles={[CLIENT_ROLE]}
        />
        <NavItem
          to={"/project/create"}
          label={"Create Project"}
          roles={[CLIENT_ROLE]}
        />
        <NavItem
          to={"/shift/view"}
          label={"Client Shifts"}
          roles={[CLIENT_ROLE]}
        />
        <NavItem
          to={"/shift/create"}
          label={"Create Shift"}
          roles={[CLIENT_ROLE]}
        />

        {/* Admin Items */}
        <NavItem
          to={"/admin/view/employees"}
          label={"View Employees"}
          roles={[ADMIN_ROLE]}
        />
      </div>
      <div className="ml-auto flex items-center">
        {user ? <LogoutButton /> : <LoginButton />}
      </div>
    </nav>
  );
};

export default Navbar;
