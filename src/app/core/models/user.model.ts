export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ROLE_ADMIN' | 'ROLE_WAREHOUSE_MANAGER' | 'ROLE_CLIENT';
  enabled: boolean;
}

