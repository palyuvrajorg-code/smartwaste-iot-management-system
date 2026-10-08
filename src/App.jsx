import React, { useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { authService } from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';

function AppLayout() {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <div className="app-container">
      {/* Sidebar rendered ONLY when logged in and NOT on login page */}
      {!isLoginPage && currentUser && (
        <Sidebar 
          currentUser={currentUser} 
          collapsed={sidebarCollapsed} 
        />
      )}

      <div className="main-content-wrapper">
        {/* Navbar rendered ONLY when logged in and NOT on login page */}
        {!isLoginPage && currentUser && (
          <Navbar
            currentUser={currentUser}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            onLogout={handleLogout}
          />
        )}

        <main className={isLoginPage ? '' : 'page-content'}>
          <AppRoutes 
            currentUser={currentUser} 
            onLoginSuccess={handleLoginSuccess} 
          />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
