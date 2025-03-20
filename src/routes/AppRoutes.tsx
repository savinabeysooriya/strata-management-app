import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { BuildingList } from '../components/dashboards/BuildingList';
import { MaintenanceRequestsList } from '../components/dashboards/MaintenanceRequestsList';
import { TenantView } from '../components/dashboards/TenantView';
import { NewRequestForm } from '../components/dashboards/NewRequestForm';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminDashboard />} />
    <Route path="/buildings" element={<BuildingList />} />
    <Route path="/requests" element={<MaintenanceRequestsList />} />
    <Route path="/my-building" element={<TenantView />} />
    <Route path="/new-request" element={<NewRequestForm />} />
  </Routes>
);