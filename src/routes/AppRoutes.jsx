import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../data/users';

// Pages
import Login from '../pages/Login';

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import SmartBins from '../pages/admin/SmartBins';
import Drivers from '../pages/admin/Drivers';
import CollectionRequests from '../pages/admin/CollectionRequests';
import AdminSettings from '../pages/admin/AdminSettings';

// Driver
import DriverHome from '../pages/driver/DriverHome';
import MyCollections from '../pages/driver/MyCollections';
import DriverNotifications from '../pages/driver/DriverNotifications';
import DriverProfile from '../pages/driver/DriverProfile';

// Technician
import TechnicianDashboard from '../pages/technician/TechnicianDashboard';
import Devices from '../pages/technician/Devices';
import SensorAlerts from '../pages/technician/SensorAlerts';
import Maintenance from '../pages/technician/Maintenance';

// Supervisor
import SupervisorDashboard from '../pages/supervisor/SupervisorDashboard';
import Collections from '../pages/supervisor/Collections';
import SupervisorDrivers from '../pages/supervisor/SupervisorDrivers';
import Reports from '../pages/supervisor/Reports';

function getDefaultRouteForRole(role) {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.DRIVER:
      return '/driver';
    case ROLES.TECHNICIAN:
      return '/technician';
    case ROLES.SUPERVISOR:
      return '/supervisor';
    default:
      return '/login';
  }
}

// Protected Route Guard
function ProtectedRoute({ currentUser, allowedRoles, children }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Role mismatch: Redirect to user's authorized home
    return <Navigate to={getDefaultRouteForRole(currentUser.role)} replace />;
  }

  return children;
}

export default function AppRoutes({ currentUser, onLoginSuccess }) {
  return (
    <Routes>
      {/* Public Login */}
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to={getDefaultRouteForRole(currentUser.role)} replace />
          ) : (
            <Login onLoginSuccess={onLoginSuccess} />
          )
        }
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          <Navigate
            to={currentUser ? getDefaultRouteForRole(currentUser.role) : '/login'}
            replace
          />
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bins"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.ADMIN]}>
            <SmartBins />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/drivers"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.ADMIN]}>
            <Drivers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requests"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.ADMIN]}>
            <CollectionRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.ADMIN]}>
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      {/* DRIVER ROUTES */}
      <Route
        path="/driver"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.DRIVER]}>
            <DriverHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/collections"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.DRIVER]}>
            <MyCollections />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/notifications"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.DRIVER]}>
            <DriverNotifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/profile"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.DRIVER]}>
            <DriverProfile />
          </ProtectedRoute>
        }
      />

      {/* TECHNICIAN ROUTES */}
      <Route
        path="/technician"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.TECHNICIAN]}>
            <TechnicianDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/technician/devices"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.TECHNICIAN]}>
            <Devices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/technician/alerts"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.TECHNICIAN]}>
            <SensorAlerts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/technician/maintenance"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.TECHNICIAN]}>
            <Maintenance />
          </ProtectedRoute>
        }
      />

      {/* SUPERVISOR ROUTES */}
      <Route
        path="/supervisor"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.SUPERVISOR]}>
            <SupervisorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisor/collections"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.SUPERVISOR]}>
            <Collections />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisor/drivers"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.SUPERVISOR]}>
            <SupervisorDrivers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supervisor/reports"
        element={
          <ProtectedRoute currentUser={currentUser} allowedRoles={[ROLES.SUPERVISOR]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route
        path="*"
        element={
          <Navigate
            to={currentUser ? getDefaultRouteForRole(currentUser.role) : '/login'}
            replace
          />
        }
      />
    </Routes>
  );
}
