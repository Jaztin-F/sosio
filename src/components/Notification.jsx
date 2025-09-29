import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Notification = ({ message, type = "success", isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getNotificationStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500/90",
          border: "border-green-400/50",
          icon: "✓",
          text: "text-white"
        };
      case "error":
        return {
          bg: "bg-red-500/90",
          border: "border-red-400/50",
          icon: "✕",
          text: "text-white"
        };
      case "warning":
        return {
          bg: "bg-yellow-500/90",
          border: "border-yellow-400/50",
          icon: "⚠",
          text: "text-white"
        };
      case "info":
        return {
          bg: "bg-blue-500/90",
          border: "border-blue-400/50",
          icon: "ℹ",
          text: "text-white"
        };
      default:
        return {
          bg: "bg-gray-500/90",
          border: "border-gray-400/50",
          icon: "ℹ",
          text: "text-white"
        };
    }
  };

  const styles = getNotificationStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div
            className={`${styles.bg} ${styles.border} backdrop-blur-sm border rounded-2xl shadow-2xl p-4 flex items-center space-x-3`}
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Icon */}
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              {styles.icon}
            </div>
            
            {/* Message */}
            <div className="flex-1">
              <p className={`${styles.text} font-medium text-sm`}>
                {message}
              </p>
            </div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200"
            >
              ✖
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
