export interface ApiResponse<T> {
    code: number;
    data: T;
}

export interface LoginResponse {
    code: number;
    msg: string;
    token: string;
}

export interface AuthMeResponse {
    code: number;
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export interface PaginatedResponse<T> {
    code: number;
    data: {
        items: T[];
        pagination: PaginationMeta;
    };
}
