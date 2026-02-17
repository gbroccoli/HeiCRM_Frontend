import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { PRIORITY_LABELS } from "@/models/task";
import type { Task, TaskPriority } from "@/models/task";
import type { ApiResponse } from "@/models/api";

const editSchema = z.object({
    task_type: z.string().min(1, "Обязательное поле"),
    description: z.string().min(1, "Обязательное поле"),
    priority: z.string().min(1, "Выберите приоритет"),
});

type EditFormValues = z.infer<typeof editSchema>;

export default function AdminTaskEditPage() {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [blocked, setBlocked] = useState(false);

    const form = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            task_type: "",
            description: "",
            priority: "",
        },
    });

    const fetchTask = useCallback(async () => {
        try {
            const { data } = await $api.get<ApiResponse<Task>>(`/tasks/${taskId}`);
            const task = data.data;
            if (task.status === "completed" || task.status === "closed") {
                setBlocked(true);
            }
            form.reset({
                task_type: task.task_type,
                description: task.description,
                priority: task.priority,
            });
        } catch {
            toast.error("Не удалось загрузить заявку");
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [taskId, form]);

    useEffect(() => {
        fetchTask();
    }, [fetchTask]);

    const onSubmit = async (values: EditFormValues) => {
        try {
            await $api.put(`/tasks/${taskId}`, values);
            toast.success("Заявка обновлена");
            navigate("/dashboard/admin/tasks");
        } catch {
            toast.error("Ошибка при обновлении заявки");
        }
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-9 w-64" />
                <div className="max-w-lg space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/tasks")}>
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Редактирование заявки</h1>
                </div>
                <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
                    <TriangleAlert className="size-10" />
                    <p>Не удалось загрузить данные заявки</p>
                    <Button variant="outline" onClick={() => navigate("/dashboard/admin/tasks")}>
                        Вернуться к списку
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/tasks")}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Редактирование заявки</h1>
            </div>

            {blocked && (
                <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-200">
                    Заявка завершена или закрыта. Редактирование недоступно.
                </div>
            )}

            <div className="max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="task_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Тип заявки</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Тип заявки" disabled={blocked} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Описание</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Описание заявки" rows={4} disabled={blocked} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Приоритет</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={blocked}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Выберите приоритет" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {(Object.entries(PRIORITY_LABELS) as [TaskPriority, string][]).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate("/dashboard/admin/tasks")}>
                                Отмена
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting || blocked}>
                                {form.formState.isSubmitting ? "Сохранение..." : "Сохранить"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
