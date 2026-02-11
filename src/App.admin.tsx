import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import BeatsPage from './pages/admin/BeatsPage';
import OrdersPage from './pages/admin/OrdersPage';
import CollaborationsPage from './pages/admin/CollaborationsPage';

const AdminApp: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login Route */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/beats"
            element={
              <ProtectedRoute requireAdmin={true}>
                <BeatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requireAdmin={true}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/collaborations"
            element={
              <ProtectedRoute requireAdmin={true}>
                <CollaborationsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect /admin to dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AdminApp;