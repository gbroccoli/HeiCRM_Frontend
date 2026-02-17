import { Users, LayoutDashboard, UserCircle, Building2, ClipboardList, type LucideIcon } from "lucide-react";

export interface NavItem {
    title: string;
    path: string;
    icon: LucideIcon;
}

export interface RoleNavConfig {
    basePath: string;
    items: NavItem[];
}

const navigation: Record<string, RoleNavConfig> = {
    admin: {
        basePath: "/dashboard/admin",
        items: [
            { title: "Главная", path: "", icon: LayoutDashboard },
            { title: "Пользователи", path: "users", icon: Users },
            { title: "Здания", path: "housing", icon: Building2 },
            { title: "Заявки", path: "tasks", icon: ClipboardList },
            { title: "Профиль", path: "profile", icon: UserCircle },
        ],
    },
    user: {
        basePath: "/dashboard/user",
        items: [
            { title: "Главная", path: "", icon: LayoutDashboard },
            { title: "Профиль", path: "profile", icon: UserCircle },
        ],
    },
    manager: {
        basePath: "/dashboard/operation",
        items: [
            { title: "Главная", path: "", icon: LayoutDashboard },
            { title: "Заявки", path: "tasks", icon: ClipboardList },
            { title: "Профиль", path: "profile", icon: UserCircle },
        ],
    },
};

export function getNavItems(role: string): { basePath: string; items: NavItem[] } {
    return navigation[role] ?? { basePath: "/dashboard", items: [] };
}
