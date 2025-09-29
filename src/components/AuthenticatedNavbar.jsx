import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

const AuthenticatedNavbar = ({ user, onSignOut }) => {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    onSignOut();
    navigate("/");
    setIsAvatarOpen(false);
  };

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
            <NavLink to="/dashboard">SOSIO</NavLink>
          </motion.div>

          {/* Authenticated Menu (desktop) */}
          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `hover:text-rose-400 ${isActive ? "text-rose-500 font-semibold" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/loan"
              className={({ isActive }) =>
                `hover:text-rose-400 ${isActive ? "text-rose-500 font-semibold" : ""}`
              }
            >
              Loan
            </NavLink>
            <NavLink
              to="/investment"
              className={({ isActive }) =>
                `hover:text-rose-400 ${isActive ? "text-rose-500 font-semibold" : ""}`
              }
            >
              Investment
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `hover:text-rose-400 ${isActive ? "text-rose-500 font-semibold" : ""}`
              }
            >
              History
            </NavLink>
          </div>

          {/* Desktop Avatar Dropdown */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setIsAvatarOpen(!isAvatarOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.codename || user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isAvatarOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.codename || user?.email?.charAt(0).toUpperCase()}
                      {user?.fullname && ` (${user.fullname})`}
                    </p>
                    <p className="text-xs text-gray-500">Member</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsAvatarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setIsAvatarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none"
            >
              {isMobileMenuOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-neutral-800 border-t border-neutral-700"
            >
              <div className="px-4 py-2 space-y-1">
                {/* Mobile User Info & Avatar */}
                <div className="flex items-center space-x-3 py-2 border-b border-neutral-700 mb-2">
                  <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.codename || user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user?.codename || user?.email?.charAt(0).toUpperCase()}
                      {user?.fullname && ` (${user.fullname})`}
                    </p>
                    <p className="text-xs text-gray-400">Member</p>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm hover:text-rose-400 ${
                      isActive ? "text-rose-500 font-semibold" : ""
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/loan"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm hover:text-rose-400 ${
                      isActive ? "text-rose-500 font-semibold" : ""
                    }`
                  }
                >
                  Loan
                </NavLink>
                <NavLink
                  to="/investment"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm hover:text-rose-400 ${
                      isActive ? "text-rose-500 font-semibold" : ""
                    }`
                  }
                >
                  Investment
                </NavLink>
                <NavLink
                  to="/history"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm hover:text-rose-400 ${
                      isActive ? "text-rose-500 font-semibold" : ""
                    }`
                  }
                >
                  History
                </NavLink>

                {/* Mobile User Actions */}
                <div className="border-t border-neutral-700 pt-2 mt-2">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-rose-400"
                  >
                    Edit Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-rose-400"
                  >
                    Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default AuthenticatedNavbar;
