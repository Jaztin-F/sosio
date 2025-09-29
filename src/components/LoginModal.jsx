import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(data.message);
        onLogin(data.user); // Pass user data to parent
        onClose();
        navigate("/dashboard");
      } else {
        // Determine notification type based on status code
        if (response.status === 400) {
          showError(data.message); // Validation errors
        } else if (response.status === 401) {
          showError(data.message); // Authentication errors
        } else {
          showError(data.message); // Other errors
        }
      }
    } catch (err) {
      console.error(err);
      showError("Unable to connect to server. Please check your internet connection and try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Glassy modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-sm z-10 p-8 rounded-3xl
                       bg-black/20 backdrop-blur-2xl border border-white/10 shadow-2xl"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
            >
              ✖
            </button>

            <h2 className="text-3xl font-bold text-center text-white mb-8">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-black/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-black/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-500/80 hover:bg-green-500 text-white py-3 rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-green-500/25 backdrop-blur-sm border border-green-400/30 hover:border-green-400/50"
              >
                Login
              </button>
            </form>

            <p className="text-sm text-white/70 mt-6 text-center">
              Don't have an account?{" "}
              <a href="#" className="text-white/80 hover:text-white hover:underline transition-colors duration-300 font-medium">
                Sign up
              </a>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
