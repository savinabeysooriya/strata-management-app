import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthProvider } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { BuildingList } from './components/dashboards/BuildingList';
import { MaintenanceRequestsList } from './components/dashboards/MaintenanceRequestsList';
import { TenantView } from './components/dashboards/TenantView';
import { NewRequestForm } from './components/dashboards/NewRequestForm';

export default function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout/>}>
              <Route index element={<AdminDashboard />} />
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/buildings" element={<BuildingList />} />
              <Route path="/requests" element={<MaintenanceRequestsList />} />
              <Route path="/my-building" element={<TenantView />} />
              <Route path="/new-request" element={<NewRequestForm />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}