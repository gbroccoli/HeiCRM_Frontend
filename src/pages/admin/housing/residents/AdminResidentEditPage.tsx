import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import type { Resident } from "@/models/resident";
import type { ApiResponse } from "@/models/api";

const editSchema = z.object({
    full_name: z.string().min(1, "Обязательное поле"),
    birth_date: z.string().min(1, "Обязательное поле"),
    email: z.string().optional(),
    phone: z.string().optional(),
    move_out_date: z.string().optional(),
});

type FormValues = z.infer<typeof editSchema>;

export default function AdminResidentEditPage() {
    const { id, roomId, residentId } = useParams<{ id: string; roomId: string; residentId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            full_name: "", birth_date: "",
            email: "", phone: "", move_out_date: "",
        },
    });

    const fetchResident = useCallback(async () => {
        try {
            const { data } = await $api.get<ApiResponse<Resident>>(
                `/housing/${id}/rooms/${roomId}/residents/${residentId}`,
            );
            const r = data.data;
            form.reset({
                full_name: r.full_name,
                birth_date: r.birth_date,
                email: r.email || "",
                phone: r.phone || "",
                move_out_date: r.move_out_date || "",
            });
        } catch {
            toast.error("Не удалось загрузить жильца");
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id, roomId, residentId, form]);

    useEffect(() => { fetchResident(); }, [fetchResident]);

    const onSubmit = async (values: FormValues) => {
        try {
            await $api.put(`/housing/${id}/rooms/${roomId}/residents`, {
                resident_id: Number(residentId),
                ...values,
            });
            toast.success("Данные жильца обновлены");
            navigate(`/dashboard/admin/housing/${id}/rooms/${roomId}`);
        } catch {
            toast.error("Ошибка при обновлении");
        }
    };

    const backPath = `/dashboard/admin/housing/${id}/rooms/${roomId}`;

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-9 w-64" />
                <div className="max-w-lg space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-10 w-full" />))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}><ArrowLeft /></Button>
                    <h1 className="text-2xl font-bold tracking-tight">Редактирование жильца</h1>
                </div>
                <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
                    <TriangleAlert className="size-10" />
                    <p>Не удалось загрузить данные</p>
                    <Button variant="outline" onClick={() => navigate(backPath)}>Вернуться</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}><ArrowLeft /></Button>
                <h1 className="text-2xl font-bold tracking-tight">Редактирование жильца</h1>
            </div>
            <div className="max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="full_name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>ФИО</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="birth_date" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Дата рождения</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="move_out_date" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Дата выселения</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Телефон</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
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
