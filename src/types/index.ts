export interface MaintenanceRequest {
    id: string;
    title: string;
    status: 'pending' | 'in-progress' | 'completed';
    building: string;
  }
  
  export type UserRole = 'admin' | 'tenant';