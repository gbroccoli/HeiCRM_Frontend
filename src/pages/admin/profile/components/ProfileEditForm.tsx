import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { $api } from "@/api/axios";
import useAuth from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import type { UserProfile } from "@/models/user";
import type { ApiResponse } from "@/models/api";

const profileSchema = z.object({
    first_name: z.string().min(1, "Имя обязательно"),
    last_name: z.string().min(1, "Фамилия обязательна"),
    middle_name: z.string().optional(),
    phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
    profile: UserProfile;
    onUpdated: () => void;
}

const ProfileEditForm = ({ profile, onUpdated }: ProfileEditFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setAuth } = useAuth();

    const form = useForm<ProfileFormValues>({
        defaultValues: {
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            middle_name: profile.middle_name || "",
            phone: profile.phone || "",
        },
    });

    const onSubmit = async (values: ProfileFormValues) => {
        try {
            setIsSubmitting(true);
            const response = await $api.put<ApiResponse<UserProfile>>("/users/me", values);
            const updated = response.data.data;

            setAuth(
                updated.id,
                updated.name,
                updated.email,
                updated.role_name,
                updated.avatar_url || ""
            );

            toast.success("Профиль успешно обновлён");
            onUpdated();
        } catch {
            toast.error("Не удалось сохранить изменения");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Редактирование профиля</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                                )}
                                Сохранить
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileEditForm;
