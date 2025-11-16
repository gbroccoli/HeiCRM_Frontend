import {cn} from "@/lib/utils.ts";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Link} from "react-router";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form} from "@/components/ui/form.tsx";

const formSchema = z.object({
    email: z.email("Некорректный email"),
    password: z.string()
        .min(8, "Пароль должен быть не короче 8 символов")
        .max(32, "Пароль не должен превышать 32 символа")
})

const LoginForm = () => {

    const form = useForm()

    return (
        <Form {...form}>
            <form className={cn("flex flex-col gap-6")}>
                <FieldGroup>
                    <div className={"flex flex-col items-center gap-1 text-center"}>
                        <h1 className={"text-xl font-bold"}>Войдите в учетную запись</h1>
                        <p className={"text-muted-foreground text-sm text-balance"}>
                            Введите свой адрес электронной почты ниже, чтобы войти в свою учетную запись.
                        </p>
                    </div>
                    <Field>
                        <FieldLabel htmlFor={"email"}>Email</FieldLabel>
                        <Input id={"email"} type={"email"} placeholder="m@example.com"  required={true} />
                    </Field>
                    <Field>
                        <div className={"flex items-center"}>
                            <FieldLabel htmlFor={"password"}>Пароль</FieldLabel>
                            <Link to={"#"} className={"ml-auto text-sm underline-offset-4 hover:underline"}>
                                Забыли пароль?
                            </Link>
                        </div>
                        <Input id={"password"} type={"password"} required={true} />
                    </Field>
                    <Field>
                        <Button type={"submit"}>Вход</Button>
                    </Field>
                </FieldGroup>
            </form>
        </Form>
    )
}

export default LoginForm