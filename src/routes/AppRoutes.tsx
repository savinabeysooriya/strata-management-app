import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { BuildingList } from '../components/dashboard/BuildingList';
// import { MaintenanceRequestsList } from '../components/dashboard/MaintenanceRequestsList';
// import { TenantView } from '../components/dashboard/TenantView';
// import { NewRequestForm } from '../components/dashboard/MaintenanceRequestsList';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminDashboard />} />
    <Route path="/buildings" element={<BuildingList />} />
    {/* <Route path="/requests" element={<MaintenanceRequestsList />} />
    <Route path="/my-building" element={<TenantView />} />
    <Route path="/new-request" element={<NewRequestForm />} /> */}
  </Routes>
);