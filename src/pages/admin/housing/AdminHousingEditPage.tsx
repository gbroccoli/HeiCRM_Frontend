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
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import type { Housing } from "@/models/housing";
import type { ApiResponse } from "@/models/api";

const editSchema = z.object({
    address: z.string().min(1, "Обязательное поле"),
    floors: z.string().min(1, "Обязательное поле"),
    description: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

export default function AdminHousingEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const form = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            address: "",
            floors: "1",
            description: "",
        },
    });

    const fetchItem = useCallback(async () => {
        try {
            const { data } = await $api.get<ApiResponse<Housing>>(`/housing/${id}`);
            const item = data.data;
            form.reset({
                address: item.address,
                floors: String(item.floors),
                description: item.description || "",
            });
        } catch {
            toast.error("Не удалось загрузить данные здания");
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id, form]);

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    const onSubmit = async (values: EditFormValues) => {
        try {
            await $api.put(`/housing/${id}`, {
                ...values,
                floors: Number(values.floors),
            });
            toast.success("Здание обновлено");
            navigate("/dashboard/admin/housing");
        } catch {
            toast.error("Ошибка при обновлении здания");
        }
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-9 w-64" />
                <div className="max-w-lg space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
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
                    <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/housing")}>
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Редактирование здания</h1>
                </div>
                <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
                    <TriangleAlert className="size-10" />
                    <p>Не удалось загрузить данные здания</p>
                    <Button variant="outline" onClick={() => navigate("/dashboard/admin/housing")}>
                        Вернуться к списку
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/housing")}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Редактирование здания</h1>
            </div>

            <div className="max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Адрес</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ул. Ленина, 10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="floors"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Количество этажей</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={1} {...field} />
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
                                        <Textarea placeholder="Общежитие №1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate("/dashboard/admin/housing")}>
                                Отмена
                            </Button>
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
