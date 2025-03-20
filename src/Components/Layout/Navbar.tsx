import LoginLogoutButton from "../Auth/LoginLogout";
import { Link } from "react-router-dom";
import { ADMIN_ROLE, CLIENT_ROLE, PSO_ROLE } from "../Auth/PermissionLock";
import NavItem from "./Navitem";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle closing when clicking a NavItem
  const handleCloseMenu = () => setIsOpen(false);

  return (
    <>
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-primary text-secondary p-4 relative">
        {/* Left Section: Logo */}
        <div className="text-secondary hover:text-white">
          <Link className="text-4xl font-medium" to="/">
            Conscoord
          </Link>
        </div>

        {/* Hamburger Button (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden flex items-center px-3 py-2 rounded text-secondary bg-slate-700 border-2 border-slate-600 hover:text-white hover:bg-slate-600 hover:border-slate-500"
        >
          <i className="bi bi-list text-2xl" />
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex flex-grow pl-10">
          {/* Left-Aligned Navigation Links */}
          <div className="flex items-center">
            <NavItem to={"/project/view"} label={"Projects"} roles={[CLIENT_ROLE, PSO_ROLE, ADMIN_ROLE]} />
            <NavItem to={"/invoiceCreation"} label={"Invoicing"} roles={[CLIENT_ROLE, ADMIN_ROLE]} />
            <NavItem to={"/shift/view/available"} label={"Available Shifts"} roles={[PSO_ROLE]} />
            <NavItem to={"/shift/view/claimed"} label={"My Shifts"} roles={[PSO_ROLE]} />
            <NavItem to={"/admin/user/view"} label={"Employees"} roles={[ADMIN_ROLE]} />
          </div>

          {/* Right-Aligned Login Button */}
          <div className="font-medium sm:text-xl p-3 sm:ml-auto hover:text-white hover:border-white">
            <LoginLogoutButton />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`transition-all duration-300 ease-in-out`}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-primary sm:hidden shadow-md"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col items-center pb-4"
              >
                {/* Mobile Menu Items */}
                <NavItem to={"/project/view"} label={"Projects"} roles={[CLIENT_ROLE, PSO_ROLE, ADMIN_ROLE]} onClick={handleCloseMenu} />
                <NavItem to={"/invoiceCreation"} label={"Invoicing"} roles={[CLIENT_ROLE, ADMIN_ROLE]} onClick={handleCloseMenu} />
                <NavItem to={"/shift/view/available"} label={"Available Shifts"} roles={[PSO_ROLE]} onClick={handleCloseMenu} />
                <NavItem to={"/shift/view/claimed"} label={"My Shifts"} roles={[PSO_ROLE]} onClick={handleCloseMenu} />
                <NavItem to={"/admin/user/view"} label={"Employees"} roles={[ADMIN_ROLE]} onClick={handleCloseMenu} />

                {/* Login/Logout Button */}
                <div className="font-medium text-xl p-3 hover:text-white hover:border-white">
                  <LoginLogoutButton />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Navbar;
