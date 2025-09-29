import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

const Navbar = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-neutral-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0 text-3xl font-bold"
            animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: "linear-gradient(to right, #fecdd3, #f43f5e, #fecdd3)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <NavLink to="/">SOSIO</NavLink>
          </motion.div>

          {/* Menu (desktop) */}
          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-rose-400 ${isActive ? "text-rose-500 font-semibold" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-rose-400 ${isActive ? "text-rose-500 font-semibold" : ""}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `hover:text-rose-400 ${isActive ? "text-rose-500 font-semibold" : ""}`
              }
            >
              Services
            </NavLink>
            {/* Login opens modal */}
            <button
              onClick={onLoginClick}
              className="hover:text-rose-400"
            >
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-neutral-800 border-t border-neutral-700"
            >
              <div className="px-4 py-2 space-y-1">
                <NavLink
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm hover:text-rose-400 ${
                      isActive ? "text-rose-500 font-semibold" : ""
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm hover:text-rose-400 ${
                      isActive ? "text-rose-500 font-semibold" : ""
                    }`
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to="/services"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm hover:text-rose-400 ${
                      isActive ? "text-rose-500 font-semibold" : ""
                    }`
                  }
                >
                  Services
                </NavLink>
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-rose-400"
                >
                  Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
