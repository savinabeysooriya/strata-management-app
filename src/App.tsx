import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthProvider } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminDashboard } from './components/views/AdminDashboard';
import { BuildingList } from './components/views/BuildingList';
import { MaintenanceRequestsList } from './components/views/MaintenanceRequestsList';
import { TenantView } from './components/views/TenantView';
import { NewRequestForm } from './components/views/NewRequestForm';
import { OwnersList } from './components/views/OwnersList';

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
              <Route path="/owners" element={<OwnersList/>} />
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