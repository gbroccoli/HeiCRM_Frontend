import useAuth from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { getAuthState } from "@/stores/auth";
import $api from "@/api/axios";
import { toast } from "sonner";

const UserInfo = () => {
    const { name, email, role, isAuthenticated } = useAuth();
    const nav = useNavigate();

    const handleLogout = async () => {
        try {
            await $api.post('/auth/logout');
            toast.success("Вы успешно вышли из учетной записи!");
        } catch {
            // Даже если API недоступен, очищаем локальное состояние
        }

        localStorage.removeItem('accessToken');
        getAuthState().clearAuth();
        nav('/');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{name || 'Пользователь'}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
                <p className="text-xs text-muted-foreground">Роль: {role}</p>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
            >
                Выйти
            </Button>
        </div>
    );
};

export default UserInfo;
