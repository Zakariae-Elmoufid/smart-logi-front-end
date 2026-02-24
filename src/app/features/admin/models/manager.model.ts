export interface Manager {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  role: string;
  enabled: boolean;
  warehouses?: WarehouseInfo[];
}

export interface WarehouseInfo {
  id: number;
  name: string;
  code: string;
}

export interface ManagerCreateDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  enabled: boolean;
  warehouseIds: number[];
}

export interface ManagerUpdateDTO {
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  warehouseIds: number[];
}

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}
