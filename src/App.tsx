import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DialysisRecordPage from './pages/DialysisRecordPage';
import VitalsignRecordPage from './pages/VitalsignRecordPage';
import ExitSiteCare from './pages/ExitSiteCare';
import AdminDashboard from './pages/AdminDashboard';
import PatientsPage from './pages/PatientsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AlertsPage from './pages/AlertRecordPage';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === UserRole.PATIENT ? '/dashboard' : '/admin-dashboard'} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* 病人路由 */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dialysis-records" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                  <DialysisRecordPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vitalsign-records" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                  <VitalsignRecordPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exitsite-care-records" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                  <ExitSiteCare />
                </ProtectedRoute>
              } 
            />
            
            {/* 個案管理師路由 */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <PatientsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/alert-records" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AlertsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* 共用路由 */}
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* 預設路由 */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;