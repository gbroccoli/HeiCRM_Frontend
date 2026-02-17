import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { $api } from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Building2, DoorOpen, Users, UserCheck, ClipboardList,
    Plus, ArrowRight,
} from "lucide-react";
import type { PaginatedResponse } from "@/models/api";
import type { Housing } from "@/models/housing";
import { formatDate } from "@/lib/utils";

interface TaskItem {
    id: number;
    author_name: string;
    assignee_name: string | null;
    room_number: string | null;
    task_type: string;
    description: string;
    priority: string;
    status: string;
    created_at: string;
}

interface StatsData {
    totalUsers: number;
    totalBuildings: number;
    totalRooms: number;
    totalResidents: number;
}

const PRIORITY_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    critical: "destructive",
    high: "destructive",
    medium: "default",
    low: "secondary",
};

const PRIORITY_LABEL: Record<string, string> = {
    critical: "Критический",
    high: "Высокий",
    medium: "Средний",
    low: "Низкий",
};

const STATUS_LABEL: Record<string, string> = {
    new: "Новая",
    assigned: "Назначена",
    in_progress: "В работе",
    completed: "Завершена",
    closed: "Закрыта",
};

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<StatsData | null>(null);
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [usersRes, housingRes, tasksRes] = await Promise.all([
                $api.get<PaginatedResponse<unknown>>("/users", { params: { page: 1, page_size: 1 } }),
                $api.get<PaginatedResponse<Housing>>("/housing", { params: { page: 1, page_size: 100 } }),
                $api.get<PaginatedResponse<TaskItem>>("/tasks", { params: { page: 1, page_size: 5 } }),
            ]);

            const buildings = housingRes.data.data.items ?? [];
            const totalRooms = buildings.reduce((sum, b) => sum + (b.room_count ?? 0), 0);
            const totalResidents = buildings.reduce((sum, b) => sum + (b.resident_count ?? 0), 0);

            setStats({
                totalUsers: usersRes.data.data.pagination.total,
                totalBuildings: housingRes.data.data.pagination.total,
                totalRooms,
                totalResidents,
            });

            setTasks(tasksRes.data.data.items ?? []);
        } catch {
            // данные не загрузились — покажем нули
            setStats({ totalUsers: 0, totalBuildings: 0, totalRooms: 0, totalResidents: 0 });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const statCards = [
        { label: "Пользователи", value: stats?.totalUsers, icon: Users, href: "/dashboard/admin/users" },
        { label: "Здания", value: stats?.totalBuildings, icon: Building2, href: "/dashboard/admin/housing" },
        { label: "Комнаты", value: stats?.totalRooms, icon: DoorOpen, href: "/dashboard/admin/housing" },
        { label: "Жильцы", value: stats?.totalResidents, icon: UserCheck, href: "/dashboard/admin/housing" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Панель управления</h1>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => (
                    <Card
                        key={card.label}
                        className="cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={() => navigate(card.href)}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {card.label}
                            </CardTitle>
                            <card.icon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <div className="text-2xl font-bold">{card.value}</div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick actions */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Button variant="outline" className="justify-start gap-2 h-auto py-3" onClick={() => navigate("/dashboard/admin/users/create")}>
                    <Plus className="size-4" />
                    <span>Новый пользователь</span>
                </Button>
                <Button variant="outline" className="justify-start gap-2 h-auto py-3" onClick={() => navigate("/dashboard/admin/housing/create")}>
                    <Plus className="size-4" />
                    <span>Новое здание</span>
                </Button>
                <Button variant="outline" className="justify-start gap-2 h-auto py-3" onClick={() => navigate("/dashboard/admin/users")}>
                    <Users className="size-4" />
                    <span>Управление пользователями</span>
                </Button>
            </div>

            {/* Recent tasks */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="size-5" />
                        Последние задачи
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/dashboard/admin/tasks")}>
                        Все задачи <ArrowRight className="size-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    ) : tasks.length === 0 ? (
                        <p className="text-muted-foreground text-center py-6">Задач пока нет</p>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Тип</TableHead>
                                        <TableHead>Описание</TableHead>
                                        <TableHead>Приоритет</TableHead>
                                        <TableHead>Статус</TableHead>
                                        <TableHead>Исполнитель</TableHead>
                                        <TableHead>Дата</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tasks.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell className="font-medium">{task.task_type}</TableCell>
                                            <TableCell className="max-w-[200px] truncate">{task.description}</TableCell>
                                            <TableCell>
                                                <Badge variant={PRIORITY_VARIANT[task.priority] ?? "secondary"}>
                                                    {PRIORITY_LABEL[task.priority] ?? task.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{STATUS_LABEL[task.status] ?? task.status}</TableCell>
                                            <TableCell>{task.assignee_name || "—"}</TableCell>
                                            <TableCell>{formatDate(task.created_at)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
