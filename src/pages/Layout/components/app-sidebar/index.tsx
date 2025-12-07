import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
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
import {BadgeCheck, Bell, ChevronsUpDown, LogOut} from "lucide-react";
import {Link, useNavigate} from "react-router";
import $api from "@/api/axios.ts";
import {toast} from "sonner";


const AppSidebar = () => {

    const auth = useAuth();
    const {isMobile} = useSidebar()
    const nav = useNavigate()

    const logout = async () => {
        const res = await $api.post("/auth/logout");

        if (res.status === 200) {
            toast.success("Вы успешно вышли из учетной записи!")
            localStorage.removeItem("accessToken");
            nav('/')
        }
    }

    return (
        <Sidebar>
            <SidebarHeader></SidebarHeader>
            <SidebarContent></SidebarContent>
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
                                       <Link to={`/dashboard/${auth.role}/profile`} className={"cursor-pointer"}>
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