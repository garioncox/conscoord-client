import LoginLogoutButton from "../Auth/LoginLogout";
import { Link } from "react-router-dom";
import { ADMIN_ROLE, CLIENT_ROLE, PSO_ROLE } from "../Auth/PermissionLock";
import NavItem from "./Navitem";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between flex-wrap bg-primary text-secondary p-4">
      <div className="text-secondary hover:text-white">
        <Link className="text-4xl font-medium" to="/">
          Conscoord
        </Link>
      </div>
      <div className="block lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 rounded text-secondary bg-slate-700 border-2 border-slate-600 hover:text-white hover:bg-slate-600 hover:border-slate-500"
        >
          <i className="bi bi-list" />
        </button>
      </div>
      <div
        className={`w-full block ${
          isOpen ? "" : "hidden"
        } flex-grow lg:ms-20 lg:flex lg:items-center lg:w-auto`}
      >
        {/* Client Items */}
        <NavItem
          to={"/project/view"}
          label={"Projects"}
          roles={[CLIENT_ROLE, PSO_ROLE]}
        />
        <NavItem
          to={"/invoiceCreation"}
          label={"Invoicing"}
          roles={[CLIENT_ROLE]}
        />

        {/* PSO + Client Items  */}
        <NavItem
          to={"/shift/view/available"}
          label={"Available Shifts"}
          roles={[PSO_ROLE]}
        />

        {/* PSO Items */}
        <NavItem
          to={"/shift/view/claimed"}
          label={"My Shifts"}
          roles={[PSO_ROLE]}
        />

        {/* Admin Items */}
        <NavItem
          to={"/admin/user/view"}
          label={"Employees"}
          roles={[ADMIN_ROLE]}
        />
        <div className="font-medium text-xl p-3 ms-2 me-auto lg:ms-auto lg:me-0 mt-4 lg:mt-0 hover:text-white hover:border-white">
          <LoginLogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
