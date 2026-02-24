export interface Carrier {
  id: number;
  carrierName: string;
  phoneNumber: string;
}

export interface CarrierRequest {
  carrierName: string;
  phoneNumber: string;
}

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}
