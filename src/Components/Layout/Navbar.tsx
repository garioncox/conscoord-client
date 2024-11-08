import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../Auth/Login";
import LogoutButton from "../Auth/Logout";
import { Link } from "react-router-dom";
import { ADMIN_ROLE, CLIENT_ROLE, PSO_ROLE } from "../Auth/PermissionLock";
import NavItem from "./Navitem";
import { useState } from "react";

const Navbar = () => {
  const { user } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between flex-wrap bg-primary text-secondary p-8">
      <div className="text-secondary hover:text-tertiary">
        <Link className="text-4xl font-bold" to="/">
          Home
        </Link>
      </div>
      <div className="block lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 border rounded text-secondary border-secondary hover:border-tertiary"
        >
          <i className="bi bi-list" />
        </button>
      </div>
      <div
        className={`w-full block ${
          isOpen ? "" : "hidden"
        } flex-grow lg:ms-20 lg:flex lg:items-center lg:w-auto`}
      >
        {/* PSO Items */}
        <NavItem
          to={"/shift/view/claimed"}
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
          to={"/shift/create"}
          label={"Create Shift"}
          roles={[CLIENT_ROLE]}
        />

        {/* PSO + Client Items  */}
        <NavItem
          to={"/shift/view/available"}
          label={"Available Shifts"}
          roles={[CLIENT_ROLE, PSO_ROLE]}
        />

        {/* Admin Items */}
        <NavItem
          to={"/admin/view/employees"}
          label={"View Employees"}
          roles={[ADMIN_ROLE]}
        />
        <div className="max-w-24 p-3 ms-2 me-auto lg:ms-auto lg:me-0 mt-4 lg:mt-0 border rounded border-secondary hover:text-tertiary hover:border-tertiary">
          {user ? <LogoutButton /> : <LoginButton />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
