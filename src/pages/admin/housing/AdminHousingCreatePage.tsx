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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const createSchema = z.object({
    address: z.string().min(1, "Обязательное поле"),
    floors: z.string().min(1, "Обязательное поле"),
    description: z.string().optional(),
});

type CreateFormValues = z.infer<typeof createSchema>;

export default function AdminHousingCreatePage() {
    const navigate = useNavigate();

    const form = useForm<CreateFormValues>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            address: "",
            floors: "1",
            description: "",
        },
    });

    const onSubmit = async (values: CreateFormValues) => {
        try {
            await $api.post("/housing/", {
                ...values,
                floors: Number(values.floors),
            });
            toast.success("Здание создано");
            navigate("/dashboard/admin/housing");
        } catch {
            toast.error("Ошибка при создании здания");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/housing")}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Новое здание</h1>
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
                                {form.formState.isSubmitting ? "Создание..." : "Создать"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
