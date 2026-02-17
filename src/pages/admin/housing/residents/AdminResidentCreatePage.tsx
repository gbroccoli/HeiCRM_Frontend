import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import type { UserProfile } from "@/models/user";

const createSchema = z.object({
    full_name: z.string().min(1, "Обязательное поле"),
    birth_date: z.string().min(1, "Обязательное поле"),
    email: z.string().optional(),
    phone: z.string().optional(),
    move_in_date: z.string().min(1, "Обязательное поле"),
});

type FormValues = z.infer<typeof createSchema>;

export default function AdminResidentCreatePage() {
    const { id, roomId } = useParams<{ id: string; roomId: string }>();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserProfile[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            full_name: "", birth_date: "",
            email: "", phone: "", move_in_date: new Date().toISOString().split("T")[0],
        },
    });

    const fetchUsers = useCallback(async () => {
        try {
            const { data } = await $api.get("/users", { params: { page: 1, page_size: 100 } });
            setUsers(data.data.items);
        } catch {
            toast.error("Не удалось загрузить список пользователей");
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const onUserSelect = (name: string) => {
        const user = users.find((u) => u.name === name);
        if (user) {
            form.setValue("full_name", user.name);
            form.setValue("email", user.email || "");
            form.setValue("phone", user.phone || "");
            if (user.date_of_birth) {
                form.setValue("birth_date", user.date_of_birth.split("T")[0]);
            }
        }
    };

    const onSubmit = async (values: FormValues) => {
        try {
            await $api.post(`/housing/${id}/rooms/${roomId}/residents`, values);
            toast.success("Жилец заселён");
            navigate(`/dashboard/admin/housing/${id}/rooms/${roomId}`);
        } catch {
            toast.error("Ошибка при заселении жильца");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/admin/housing/${id}/rooms/${roomId}`)}><ArrowLeft /></Button>
                <h1 className="text-2xl font-bold tracking-tight">Заселение жильца</h1>
            </div>
            <div className="max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="full_name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>ФИО</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={(value) => { field.onChange(value); onUserSelect(value); }}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Выберите пользователя" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {users.map((item) => (
                                                    <SelectItem value={item.name} key={item.id}>{item.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
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
                            <FormField control={form.control} name="move_in_date" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Дата заселения</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input placeholder="email@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Телефон</FormLabel>
                                    <FormControl><Input placeholder="+79001234567" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate(`/dashboard/admin/housing/${id}/rooms/${roomId}`)}>Отмена</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Заселение..." : "Заселить"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
