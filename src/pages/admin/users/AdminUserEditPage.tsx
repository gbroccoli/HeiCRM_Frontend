import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import type { UserProfile } from "@/models/user";
import type { ApiResponse } from "@/models/api";

const ROLES = [
    { id: 1, name: "Администратор" },
    { id: 2, name: "Менеджер" },
    { id: 3, name: "Пользователь" },
];

const editSchema = z.object({
    first_name: z.string().min(1, "Обязательное поле"),
    last_name: z.string().min(1, "Обязательное поле"),
    middle_name: z.string().optional(),
    phone: z.string().optional(),
    date_of_birth: z.string().optional(),
    role_id: z.string().min(1, "Выберите роль"),
});

type EditFormValues = z.infer<typeof editSchema>;

export default function AdminUserEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const form = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            middle_name: "",
            phone: "",
            date_of_birth: "",
            role_id: "",
        },
    });

    const fetchUser = useCallback(async () => {
        try {
            const { data } = await $api.get<ApiResponse<UserProfile>>(`/users/${id}`);
            const user = data.data;
            form.reset({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                middle_name: user.middle_name || "",
                phone: user.phone || "",
                date_of_birth: user.date_of_birth || "",
                role_id: String(user.role_id),
            });
        } catch {
            toast.error("Не удалось загрузить пользователя");
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id, form]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const onSubmit = async (values: EditFormValues) => {
        try {
            await $api.put(`/users/${id}`, {
                ...values,
                role_id: Number(values.role_id),
            });
            toast.success("Пользователь обновлён");
            navigate("/dashboard/admin/users");
        } catch {
            toast.error("Ошибка при обновлении пользователя");
        }
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-9 w-64" />
                <div className="max-w-lg space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
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
                    <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/users")}>
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Редактирование пользователя</h1>
                </div>
                <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
                    <TriangleAlert className="size-10" />
                    <p>Не удалось загрузить данные пользователя</p>
                    <Button variant="outline" onClick={() => navigate("/dashboard/admin/users")}>
                        Вернуться к списку
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/users")}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Редактирование пользователя</h1>
            </div>

            <div className="max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Фамилия</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Иванов" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Имя</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Иван" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="middle_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Отчество</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Иванович" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Телефон</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+7 (999) 123-45-67" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date_of_birth"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Дата рождения</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="role_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Роль</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Выберите роль" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ROLES.map((role) => (
                                                <SelectItem key={role.id} value={String(role.id)}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate("/dashboard/admin/users")}>
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
