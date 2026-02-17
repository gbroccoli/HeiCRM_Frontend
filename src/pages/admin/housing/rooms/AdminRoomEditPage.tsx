import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import type { Room } from "@/models/room";
import type { ApiResponse } from "@/models/api";

const editSchema = z.object({
    room_number: z.string().min(1, "Обязательное поле"),
    floor: z.string().min(1, "Обязательное поле"),
    capacity: z.string().min(1, "Обязательное поле"),
    room_type: z.string().min(1, "Выберите тип"),
    status: z.string().min(1, "Выберите статус"),
});

type FormValues = z.infer<typeof editSchema>;

export default function AdminRoomEditPage() {
    const { id, roomId } = useParams<{ id: string; roomId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: { room_number: "", floor: "1", capacity: "1", room_type: "", status: "" },
    });

    const fetchRoom = useCallback(async () => {
        try {
            const { data } = await $api.get<ApiResponse<Room>>(`/housing/${id}/rooms/${roomId}`);
            const r = data.data;
            form.reset({
                room_number: r.room_number,
                floor: String(r.floor),
                capacity: String(r.capacity),
                room_type: r.room_type,
                status: r.status,
            });
        } catch {
            toast.error("Не удалось загрузить комнату");
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id, roomId, form]);

    useEffect(() => { fetchRoom(); }, [fetchRoom]);

    const onSubmit = async (values: FormValues) => {
        try {
            await $api.put(`/housing/${id}/rooms/${roomId}`, {
                room_number: values.room_number,
                floor: Number(values.floor),
                capacity: Number(values.capacity),
                room_type: values.room_type,
                status: values.status,
            });
            toast.success("Комната обновлена");
            navigate(`/dashboard/admin/housing/${id}/rooms`);
        } catch {
            toast.error("Ошибка при обновлении комнаты");
        }
    };

    const backPath = `/dashboard/admin/housing/${id}/rooms`;

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-9 w-64" />
                <div className="max-w-lg space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} className="h-10 w-full" />))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}><ArrowLeft /></Button>
                    <h1 className="text-2xl font-bold tracking-tight">Редактирование комнаты</h1>
                </div>
                <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
                    <TriangleAlert className="size-10" />
                    <p>Не удалось загрузить данные комнаты</p>
                    <Button variant="outline" onClick={() => navigate(backPath)}>Вернуться к списку</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}><ArrowLeft /></Button>
                <h1 className="text-2xl font-bold tracking-tight">Редактирование комнаты</h1>
            </div>
            <div className="max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="room_number" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Номер комнаты</FormLabel>
                                <FormControl><Input placeholder="101" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="floor" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Этаж</FormLabel>
                                    <FormControl><Input type="number" min={1} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="capacity" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Вместимость</FormLabel>
                                    <FormControl><Input type="number" min={1} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="room_type" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Тип</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="single">Одноместная</SelectItem>
                                            <SelectItem value="double">Двухместная</SelectItem>
                                            <SelectItem value="block">Блок</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Статус</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="free">Свободна</SelectItem>
                                            <SelectItem value="occupied">Занята</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate(backPath)}>Отмена</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Сохранение..." : "Сохранить"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
