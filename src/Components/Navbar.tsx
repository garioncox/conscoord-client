import LoginButton from "./Login";
import LogoutButton from "./Logout";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary py-3">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Navbar
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
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/shift/view">
                  Client Shifts
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/shift/view/officer">
                  Officer Shifts
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/project/view">
                  Projects
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/project/create">
                  Create Project
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/shift/create">
                  Create Shift
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/view/employees">
                  View Employees
                </Link>
              </li>
            </ul>

            <ul className="ms-auto navbar-nav">
              <li className="nav-item mx-2">
                <LoginButton />
              </li>
              <li className="nav-item mx-2">
                <LogoutButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
