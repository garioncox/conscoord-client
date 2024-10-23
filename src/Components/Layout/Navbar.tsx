import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../Auth/Login";
import LogoutButton from "../Auth/Logout";
import { Link } from "react-router-dom";
import { ADMIN_ROLE, CLIENT_ROLE, PSO_ROLE } from "../Auth/PermissionLock";
import NavItem from "./Navitem";

const Navbar = () => {
  const { user } = useAuth0();

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary py-3">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Home
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {/* PSO Items */}
              <NavItem
                to={"/shift/view/officer"}
                label={"Officer Shifts"}
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
            </ul>

            <ul className="ms-auto navbar-nav">
              <li className="nav-item mx-2">
                {user ? <LogoutButton /> : <LoginButton />}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
