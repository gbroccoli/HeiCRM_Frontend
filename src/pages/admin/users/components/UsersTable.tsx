import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { UserProfile } from "@/models/user";
import { formatDate } from "@/lib/utils";

interface UsersTableProps {
    users: UserProfile[];
    loading: boolean;
    onEdit: (user: UserProfile) => void;
    onDelete: (user: UserProfile) => void;
}

function getRoleBadgeVariant(roleName: string) {
    switch (roleName.toLowerCase()) {
        case "администратор":
            return "destructive" as const;
        case "менеджер":
            return "default" as const;
        default:
            return "secondary" as const;
    }
}

export default function UsersTable({ users, loading, onEdit, onDelete }: UsersTableProps) {
    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-muted-foreground py-12 text-center">
                Пользователи не найдены
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ФИО</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Телефон</TableHead>
                        <TableHead>Дата регистрации</TableHead>
                        <TableHead className="w-[50px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => {
                        const fullName = [user.last_name, user.first_name, user.middle_name]
                            .filter(Boolean)
                            .join(" ");

                        return (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{fullName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={getRoleBadgeVariant(user.role_name)}>
                                        {user.role_name}
                                    </Badge>
                                </TableCell>
                                <TableCell>{user.phone || "—"}</TableCell>
                                <TableCell>{formatDate(user.created_at)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon-sm">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(user)}>
                                                <Pencil />
                                                Редактировать
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onClick={() => onDelete(user)}
                                            >
                                                <Trash2 />
                                                Удалить
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
