export interface Room {
    id: number;
    building_id: number;
    room_number: string;
    floor: number;
    capacity: number;
    room_type: "single" | "double" | "block";
    status: "free" | "occupied";
    occupancy?: number;
    residents?: RoomResident[];
    created_at: string;
    updated_at: string;
}

export interface RoomResident {
    id: number;
    full_name: string;
    birth_date: string;
    email?: string | null;
    phone?: string | null;
    move_in_date: string;
    move_out_date: string | null;
}

export interface RoomCreatePayload {
    room_number: string;
    floor: number;
    capacity: number;
    room_type: "single" | "double" | "block";
}

export interface RoomUpdatePayload {
    room_number?: string;
    floor?: number;
    capacity?: number;
    room_type?: "single" | "double" | "block";
    status?: "free" | "occupied";
}
