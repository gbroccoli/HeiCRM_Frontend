import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu, SidebarMenuButton,
    SidebarMenuItem, useSidebar
} from "@/components/ui/sidebar.tsx";
import useAuth from "@/stores/auth.ts";
import {DropdownMenu} from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {BadgeCheck, Bell, ChevronsUpDown, LogOut, Waypoints} from "lucide-react";
import {Link, useLocation, useNavigate} from "react-router";
import $api from "@/api/axios.ts";
import {toast} from "sonner";
import {getNavItems} from "@/config/navigation.ts";


const AppSidebar = () => {

    const auth = useAuth();
    const {isMobile} = useSidebar()
    const nav = useNavigate()
    const location = useLocation()
    const { basePath, items } = getNavItems(auth.role)

    const logout = async () => {
        try {
            await $api.post("/auth/logout");
            toast.success("Вы успешно вышли из учетной записи!");
        } catch {
            // Даже если API недоступен, очищаем локальное состояние
        }

        localStorage.removeItem("accessToken");
        auth.clearAuth();
        nav('/');
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size={"lg"} asChild>
                            <Link to={"#"}>
                                <div className={"bg-[hsl(118_81%_39%)] text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"}>
                                    <Waypoints className={"size-4"} />
                                </div>
                                <div className={"grid flex-1 text-left text-sm leading-tight"}>
                                    <span className={"truncate font-medium"}>ObsiOne</span>
                                    <span className={"truncate text-xs"}>Для общежитий</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Навигация</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const fullPath = item.path ? `${basePath}/${item.path}` : basePath;
                                const isActive = item.path
                                    ? location.pathname.startsWith(fullPath)
                                    : location.pathname === basePath;
                                return (
                                    <SidebarMenuItem key={fullPath}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link to={fullPath}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size={"lg"} className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                    <Avatar className={"h-8 w-8 rounded-full"}>
                                        <AvatarImage src={auth.avatar.length === 0 ? "/profile.png" : auth.avatar} alt={auth.name} />
                                        <AvatarFallback className="rounded-lg">auth.name</AvatarFallback>
                                    </Avatar>
                                    <div className={"grid flex-1 text-left text-sm leading-tight"}>
                                        <span className={"truncate font-medium"}>{auth.name}</span>
                                        <span className={"truncate text-sm"}>{auth.email}</span>
                                    </div>
                                    <ChevronsUpDown className={"ml-auto size-4"} />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                            className={"w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"} side={isMobile ? "bottom" : "right"} align={"end"} sideOffset={4}>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={auth.avatar.length === 0 ? "/profile.png" : auth.avatar} alt={auth.name} />
                                            <AvatarFallback className="rounded-lg">auth.name</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{auth.name}</span>
                                            <span className="truncate text-xs">{auth.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                       <Link to={`/dashboard/${auth.role === "manager" ? "operation" : auth.role}/profile`} className={"cursor-pointer"}>
                                           <BadgeCheck/>
                                           Профиль
                                       </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Bell />
                                        УВедомления
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className={"cursor-pointer"} onClick={logout}>
                                        <LogOut />
                                        Выход
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar