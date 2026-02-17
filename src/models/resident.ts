export interface Resident {
    id: number;
    room_id: number;
    full_name: string;
    birth_date: string;
    email?: string | null;
    phone?: string | null;
    move_in_date: string;
    move_out_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface ResidentCreatePayload {
    full_name: string;
    birth_date: string;
    email?: string;
    phone?: string;
    move_in_date: string;
}

export interface ResidentUpdatePayload {
    resident_id: number;
    full_name?: string;
    birth_date?: string;
    email?: string;
    phone?: string;
    move_out_date?: string;
}

export interface ResidentTransferPayload {
    resident_id: number;
    new_building_id: number;
    new_room_id: number;
}
