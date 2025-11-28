import {cn} from "@/lib/utils.ts";
import {Input} from "@/components/ui/input.tsx";
import {Link, useNavigate} from "react-router";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import $api from "@/api/axios.ts";

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

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const res = await $api.post('/auth/login', {
            email: data.email,
            password: data.password
        })

        if (res.status === 200) {
            localStorage.setItem('accessToken', res.data.token)
            nav('/dashboard')
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
                <Button type={"submit"}>Вход</Button>
            </form>
        </Form>
    )
}

export default LoginForm