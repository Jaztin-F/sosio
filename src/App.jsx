import { useState, useEffect } from "react";
import { Navbar, AuthenticatedNavbar, LoginModal } from "./components";
import { Home, About } from "./pages/public";
import { Members, Dashboard, Loan, Investment, History } from "./pages/authenticated";
import { NotificationProvider } from "./contexts/NotificationContext";
import { Routes, Route } from "react-router-dom";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedUser && savedAuth === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleSignOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <NotificationProvider>
      <div>
        {/* Conditional Navbar */}
        {isAuthenticated ? (
          <AuthenticatedNavbar user={user} onSignOut={handleSignOut} />
        ) : (
          <Navbar onLoginClick={() => setIsLoginOpen(true)} />
        )}

        <div className="p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            {/* Authenticated Routes */}
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Home />} />
            <Route path="/loan" element={isAuthenticated ? <Loan /> : <Home />} />
            <Route path="/investment" element={isAuthenticated ? <Investment /> : <Home />} />
            <Route path="/history" element={isAuthenticated ? <History /> : <Home />} />
            <Route path="/members" element={isAuthenticated ? <Members /> : <Home />} />
          </Routes>
        </div>

        {/* Login modal (only for non-authenticated users) */}
        {!isAuthenticated && (
          <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </NotificationProvider>
  );
}

export default App;
