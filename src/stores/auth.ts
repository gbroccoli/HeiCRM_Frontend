import { create } from "zustand";

interface AuthState {
    name: string;
    email: string;
    role: string;
    avatar: string;
    isAuthenticated: boolean;
    setAuth: (name: string, email: string, role: string, avatar: string) => void;
    clearAuth: () => void;
}

const useAuth = create<AuthState>((set) => ({
    name: "",
    email: "",
    role: "",
    isAuthenticated: false,
    avatar: "",
    setAuth: (name, email, role, avatar) =>
        set({
            name,
            email,
            role,
            avatar,
            isAuthenticated: true,
        }),
    clearAuth: () =>
        set({
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