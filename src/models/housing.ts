export interface Housing {
    id: number;
    address: string;
    floors: number;
    description: string;
    room_count: number;
    resident_count: number;
    created_at: string;
    updated_at: string;
}

export interface HousingCreatePayload {
    address: string;
    floors: number;
    description?: string;
}

export interface HousingUpdatePayload {
    address?: string;
    floors?: number;
    description?: string;
}
