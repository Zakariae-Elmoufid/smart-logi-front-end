export interface WarehouseRequestDTO {
    name: string;
    address: string;
    code: string;
    active: boolean;
}

export interface WarehouseResponseDTO {
    id: number;
    name: string;
    code: string;
    address: string;
    active: boolean;
}

export interface ApiResponse<T> {
    message: string;
    status: number;
    data: T;
}
