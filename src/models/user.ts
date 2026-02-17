export interface UserProfile {
    id: number;
    name: string;
    email: string;
    role_id: number;
    role_name: string;
    first_name: string;
    last_name: string;
    middle_name?: string | null;
    phone?: string | null;
    student_id?: string | null;
    room_id?: number | null;
    avatar_url?: string | null;
    date_of_birth?: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserCreatePayload {
    name: string;
    email: string;
    role_id: number;
    tg_send?: boolean;
}

export interface UserUpdatePayload {
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    phone?: string;
    date_of_birth?: string;
    role_id?: number;
}
