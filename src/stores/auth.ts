import { create } from "zustand";

interface AuthState {
    id: number | null;
    name: string;
    email: string;
    role: string;
    avatar: string;
    isAuthenticated: boolean;
    setAuth: (id: number, name: string, email: string, role: string, avatar: string) => void;
    clearAuth: () => void;
}

const useAuth = create<AuthState>((set) => ({
    id: null,
    name: "",
    email: "",
    role: "",
    isAuthenticated: false,
    avatar: "",
    setAuth: (id, name, email, role, avatar) =>
        set({
            id,
            name,
            email,
            role,
            avatar,
            isAuthenticated: true,
        }),
    clearAuth: () =>
        set({
            id: null,
            name: "",
            email: "",
            role: "",
            avatar: "",
            isAuthenticated: false,
        }),
}));

// Экспортируем хук и getState для использования вне компонентов
export default useAuth;
export const getAuthState = () => useAuth.getState();