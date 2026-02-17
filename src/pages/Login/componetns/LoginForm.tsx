import {cn} from "@/lib/utils.ts";
import {Input} from "@/components/ui/input.tsx";
import {Link, useNavigate} from "react-router";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import $api from "@/api/axios.ts";
import {toast} from "sonner";
import {useState} from "react";
import {LoaderCircle} from "lucide-react";
import type {AxiosError} from "axios";
import type {LoginResponse} from "@/models/api.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
    email: z.email("Некорректный email"),
    password: z.string()
        .min(8, "Пароль должен быть не короче 8 символов")
        .max(32, "Пароль не должен превышать 32 символа")
})

const LoginForm = () => {

    const form = useForm<z.infer<typeof formSchema>>()
    const nav = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);

        try {
            const res = await $api.post<LoginResponse>('/auth/login', {
                email: data.email,
                password: data.password
            });

            if (res.status === 200) {
                toast.success("Авторизация прошла успешно", {
                    duration: 5000,
                });
                // Сохраняем accessToken (refreshToken приходит в HTTPOnly cookie)
                localStorage.setItem('accessToken', res.data.token);

                // Данные пользователя загрузятся в dashboard loader через /auth/me
                nav('/dashboard');
            }
        } catch (error: unknown) {
            // Приводим к AxiosError для удобной работы
            const axiosError = error as AxiosError;

            // Обработка различных типов ошибок
            if (axiosError.response?.status === 401) {
                // Неверный логин или пароль
                toast.error("Неверный email или пароль", {
                    duration: 5000,
                });
            } else if (axiosError.response?.status === 400) {
                // Ошибка валидации
                const errorMessage = (axiosError.response?.data as { message?: string })?.message;
                toast.error(errorMessage || "Некорректные данные", {
                    duration: 5000,
                });
            } else if (axiosError.code === 'ERR_NETWORK') {
                // Ошибка сети
                toast.error("Ошибка подключения к серверу", {
                    duration: 5000,
                });
            } else {
                // Другие ошибки
                toast.error("Произошла ошибка при авторизации", {
                    duration: 5000,
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
                <div className={"flex flex-col items-center gap-1 text-center"}>
                    <h1 className={"text-xl font-bold"}>Войдите в учетную запись</h1>
                    <p className={"text-muted-foreground text-sm text-balance"}>
                        Введите свой адрес электронной почты ниже, чтобы войти в свою учетную запись.
                    </p>
                </div>
                <FormField control={form.control} name={"email"} render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type={"email"} placeholder={"m@example.com"} required={true} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name={"password"}  render={({field}) => (
                    <>
                        <div className={"flex items-center"}>
                            <FormLabel htmlFor={"password"}>Пароль</FormLabel>
                            <Link to={"#"} className={"ml-auto text-sm underline-offset-4 hover:underline"}>
                                Забыли пароль?
                            </Link>
                        </div>

                        <FormControl>
                            <Input id={"password"} type={"password"} required={true} {...field} />
                        </FormControl>

                        <FormMessage/>
                    </>
                )} />

                {form.formState.errors.root && (
                    <div className="text-sm font-medium text-destructive">
                        {form.formState.errors.root.message}
                    </div>
                )}

                <Button type={"submit"} disabled={loading}>{loading ? <LoaderCircle className={"animate-spin w-4 h-4 aspect-square"} />  : "Вход"}</Button>
            </form>
        </Form>
    )
}

export default LoginForm