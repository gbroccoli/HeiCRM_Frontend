import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

const createSchema = z.object({
    room_number: z.string().min(1, "Обязательное поле"),
    floor: z.string().min(1, "Обязательное поле"),
    capacity: z.string().min(1, "Обязательное поле"),
    room_type: z.string().min(1, "Выберите тип"),
});

type FormValues = z.infer<typeof createSchema>;

export default function AdminRoomCreatePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const form = useForm<FormValues>({
        resolver: zodResolver(createSchema),
        defaultValues: { room_number: "", floor: "1", capacity: "2", room_type: "" },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            await $api.post(`/housing/${id}/rooms`, {
                room_number: values.room_number,
                floor: Number(values.floor),
                capacity: Number(values.capacity),
                room_type: values.room_type,
            });
            toast.success("Комната создана");
            navigate(`/dashboard/admin/housing/${id}/rooms`);
        } catch {
            toast.error("Ошибка при создании комнаты");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/admin/housing/${id}/rooms`)}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Новая комната</h1>
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
                        <FormField control={form.control} name="room_type" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Тип комнаты</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Выберите тип" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="single">Одноместная</SelectItem>
                                        <SelectItem value="double">Двухместная</SelectItem>
                                        <SelectItem value="block">Блок</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate(`/dashboard/admin/housing/${id}/rooms`)}>Отмена</Button>
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
