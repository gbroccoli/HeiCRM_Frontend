import {Outlet, useLoaderData, useNavigation, useLocation} from "react-router";
import useAuth from "@/stores/auth.ts";
import {useEffect, useState} from "react";
import DashboardSkeleton from "@/components/DashboardSkeleton.tsx";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/pages/Layout/components/app-sidebar";
import {Toaster} from "@/components/ui/sonner.tsx";
import {useMediaQuery} from "@/hooks";
import {BREAKPOINTS} from "@/hooks/breakpoints.ts";

const Layout = () => {

    const isMobile = useMediaQuery(BREAKPOINTS.lg);

    // Получаем данные из loader'а
    const data = useLoaderData() as {
        userRole: {
            role: string;
            name?: string;
            email?: string;
            avatar?: string;
        } | null;
    };

    const { setAuth } = useAuth();
    const navigation = useNavigation();
    const location = useLocation();
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Синхронизируем данные из loader с store
    useEffect(() => {
        if (data.userRole) {
            setAuth(
                data.userRole.name || '',
                data.userRole.email || '',
                data.userRole.role || '',
                data.userRole.avatar || ''
            );
        }
    }, [data.userRole, setAuth]);

    // Отмечаем что начальная загрузка завершена
    useEffect(() => {
        if (navigation.state === "idle" && isInitialLoad) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsInitialLoad(false);
        }
    }, [navigation.state, isInitialLoad]);

    // Показываем skeleton только при начальной загрузке или загрузке базового /dashboard
    const isBaseDashboard = location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    const shouldShowSkeleton = navigation.state === "loading" && (isInitialLoad || isBaseDashboard);

    if (shouldShowSkeleton) {
        return <DashboardSkeleton />;
    }

    // Редирект теперь происходит в loader'е, здесь только рендерим
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className={"flex h-16 shrink-0 items-center gap-2 border-b px-4"}>
                    <SidebarTrigger className={"-ml-1"} />
                </div>
                <Outlet context={{ userRole: data.userRole }} />
            </SidebarInset>
            <Toaster position={!isMobile ? "bottom-center" : "bottom-right"} />
        </SidebarProvider>
    );
};

export default Layout