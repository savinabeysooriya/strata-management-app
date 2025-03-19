import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AppRoutes } from './routes/AppRoutes';
import { UserRole } from './types';

export default function App() {
  const [userRole] = useState<UserRole>('admin');

  return (
    <Router>
      <AppLayout userRole={userRole}>
        <AppRoutes />
      </AppLayout>
    </Router>
  );
}