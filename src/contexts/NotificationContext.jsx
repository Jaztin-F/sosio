import { createContext, useContext, useState } from "react";

export const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, duration) => addNotification(message, "success", duration);
  const showError = (message, duration) => addNotification(message, "error", duration);
  const showWarning = (message, duration) => addNotification(message, "warning", duration);
  const showInfo = (message, duration) => addNotification(message, "info", duration);

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      
      {/* Render all notifications */}
      {notifications.map(notification => (
        <div
          key={notification.id}
          className="fixed top-4 right-4 z-50 max-w-sm bg-green-500/90 border border-green-400/50 backdrop-blur-sm rounded-2xl shadow-2xl p-4 flex items-center space-x-3"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
            ✓
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200"
          >
            ✖
          </button>
        </div>
      ))}
    </NotificationContext.Provider>
  );
};
