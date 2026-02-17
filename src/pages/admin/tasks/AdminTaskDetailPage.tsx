import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import useAuth from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Pencil,
    UserPlus,
    RefreshCw,
    HandHelping,
    TriangleAlert,
} from "lucide-react";
import type { Task } from "@/models/task";
import type { ApiResponse } from "@/models/api";
import {
    STATUS_LABELS,
    PRIORITY_LABELS,
    PRIORITY_VARIANT,
    STATUS_VARIANT,
    STATUS_TRANSITIONS,
} from "@/models/task";
import TaskComments from "./components/TaskComments";
import TaskHistory from "./components/TaskHistory";
import TaskAttachments from "./components/TaskAttachments";
import TaskStatusDialog from "./components/TaskStatusDialog";
import TaskAssignDialog from "./components/TaskAssignDialog";

export default function AdminTaskDetailPage() {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const authUser = useAuth();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [statusOpen, setStatusOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);

    const fetchTask = useCallback(async () => {
        try {
            const { data } = await $api.get<ApiResponse<Task>>(`/tasks/${taskId}`);
            setTask(data.data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        fetchTask();
    }, [fetchTask]);

    const handleTakeTask = async () => {
        try {
            await $api.put(`/tasks/${taskId}/assign`, {
                assignee_id: authUser.id,
            });
            toast.success("Заявка взята на себя");
            fetchTask();
        } catch {
            toast.error("Ошибка при назначении");
        }
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-48 w-full" />
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/tasks")}>
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Заявка</h1>
                </div>
                <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
                    <TriangleAlert className="size-10" />
                    <p>Не удалось загрузить заявку</p>
                    <Button variant="outline" onClick={() => navigate("/dashboard/admin/tasks")}>
                        Вернуться к списку
                    </Button>
                </div>
            </div>
        );
    }

    const canChangeStatus = (STATUS_TRANSITIONS[task.status] ?? []).length > 0;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/tasks")}>
                    <ArrowLeft />
                </Button>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold tracking-tight">{task.task_type}</h1>
                    <Badge variant={PRIORITY_VARIANT[task.priority]}>
                        {PRIORITY_LABELS[task.priority]}
                    </Badge>
                    <Badge variant={STATUS_VARIANT[task.status]}>
                        {STATUS_LABELS[task.status]}
                    </Badge>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {!task.assignee_id && (
                    <Button variant="outline" size="sm" onClick={handleTakeTask}>
                        <HandHelping className="size-4" />
                        Взять на себя
                    </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setAssignOpen(true)}>
                    <UserPlus className="size-4" />
                    Назначить
                </Button>
                {canChangeStatus && (
                    <Button variant="outline" size="sm" onClick={() => setStatusOpen(true)}>
                        <RefreshCw className="size-4" />
                        Сменить статус
                    </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/admin/tasks/${task.id}/edit`)}>
                    <Pencil className="size-4" />
                    Редактировать
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Информация</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <dt className="text-muted-foreground">Автор</dt>
                            <dd className="font-medium">{task.author_name}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">Исполнитель</dt>
                            <dd className="font-medium">{task.assignee_name || "Не назначен"}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">Комната</dt>
                            <dd className="font-medium">
                                {task.room_number ? `${task.building_address}, ${task.room_number}` : "—"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">Создана</dt>
                            <dd className="font-medium">{new Date(task.created_at).toLocaleString("ru-RU")}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">Обновлена</dt>
                            <dd className="font-medium">{new Date(task.updated_at).toLocaleString("ru-RU")}</dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <p className="text-sm whitespace-pre-wrap">{task.description}</p>
                </CardContent>
            </Card>

            <Tabs defaultValue="comments">
                <TabsList>
                    <TabsTrigger value="comments">Комментарии</TabsTrigger>
                    <TabsTrigger value="history">История</TabsTrigger>
                    <TabsTrigger value="attachments">Вложения</TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="pt-4">
                    <TaskComments taskId={task.id} />
                </TabsContent>
                <TabsContent value="history" className="pt-4">
                    <TaskHistory taskId={task.id} />
                </TabsContent>
                <TabsContent value="attachments" className="pt-4">
                    <TaskAttachments taskId={task.id} />
                </TabsContent>
            </Tabs>

            <TaskStatusDialog
                open={statusOpen}
                onOpenChange={setStatusOpen}
                taskId={task.id}
                currentStatus={task.status}
                onUpdated={fetchTask}
            />

            <TaskAssignDialog
                open={assignOpen}
                onOpenChange={setAssignOpen}
                taskId={task.id}
                onUpdated={fetchTask}
            />
        </div>
    );
}
