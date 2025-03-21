import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AppRoutes } from './routes/AppRoutes';
import { UserRole } from './types';
import { AuthProvider } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { BuildingList } from './components/dashboards/BuildingList';
import { MaintenanceRequestsList } from './components/dashboards/MaintenanceRequestsList';
import { TenantView } from './components/dashboards/TenantView';
import { NewRequestForm } from './components/dashboards/NewRequestForm';

export default function App() {
  const [userRole] = useState<UserRole>('admin');

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout userRole={userRole} />}>
              <Route index element={<AdminDashboard />} />
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/buildings" element={<BuildingList />} />
              <Route path="/requests" element={<MaintenanceRequestsList />} />
              <Route path="/my-building" element={<TenantView />} />
              <Route path="/new-request" element={<NewRequestForm />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}