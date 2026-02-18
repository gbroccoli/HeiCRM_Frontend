import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowLeft } from "lucide-react";
import { PRIORITY_LABELS } from "@/models/task";
import type { TaskPriority } from "@/models/task";
import type { PaginatedResponse } from "@/models/api";
import type { Housing } from "@/models/housing";
import type { Room } from "@/models/room";

const createSchema = z.object({
    task_type: z.string().min(1, "Обязательное поле"),
    description: z.string().min(1, "Обязательное поле"),
    priority: z.string().min(1, "Выберите приоритет"),
    building_id: z.string().min(1, "Выберите здание"),
    room_id: z.string().min(1, "Выберите комнату"),
});

type CreateFormValues = z.infer<typeof createSchema>;

export default function AdminTaskCreatePage() {
    const navigate = useNavigate();
    const [buildings, setBuildings] = useState<Housing[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(false);

    const form = useForm<CreateFormValues>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            task_type: "",
            description: "",
            priority: "",
            building_id: "",
            room_id: "",
        },
    });

    useEffect(() => {
        $api.get<PaginatedResponse<Housing>>("/housing/", { params: { page: 1, page_size: 100 } })
            .then(({ data }) => setBuildings(data.data.items ?? []))
            .catch(() => setBuildings([]));
    }, []);

    const fetchRooms = (buildingId: string) => {
        if (!buildingId) {
            setRooms([]);
            return;
        }
        setRoomsLoading(true);
        form.setValue("room_id", "");
        $api.get<PaginatedResponse<Room>>(`/housing/${buildingId}/rooms`, { params: { page: 1, page_size: 100 } })
            .then(({ data }) => setRooms(data.data.items ?? []))
            .catch(() => setRooms([]))
            .finally(() => setRoomsLoading(false));
    };

    const onSubmit = async (values: CreateFormValues) => {
        try {
            await $api.post("/tasks/", {
                task_type: values.task_type,
                description: values.description,
                priority: values.priority,
                room_id: Number(values.room_id),
            });
            toast.success("Заявка создана");
            navigate("/dashboard/admin/tasks");
        } catch {
            toast.error("Ошибка при создании заявки");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/tasks")}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Новая заявка</h1>
            </div>

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
                                        <Input placeholder="Например: Ремонт, Уборка, Замена" {...field} />
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
                                        <Textarea placeholder="Опишите проблему или задачу..." rows={4} {...field} />
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
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="building_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Здание</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                fetchRooms(value);
                                            }}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Выберите здание" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {buildings.map((b) => (
                                                    <SelectItem key={b.id} value={String(b.id)}>
                                                        {b.address}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="room_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Комната</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={rooms.length === 0 && !roomsLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={roomsLoading ? "Загрузка..." : "Выберите комнату"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {rooms.map((r) => (
                                                    <SelectItem key={r.id} value={String(r.id)}>
                                                        {r.room_number}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate("/dashboard/admin/tasks")}>
                                Отмена
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Создание..." : "Создать"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
