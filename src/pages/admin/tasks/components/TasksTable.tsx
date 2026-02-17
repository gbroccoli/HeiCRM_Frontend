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
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/models/task";
import {
    STATUS_LABELS,
    PRIORITY_LABELS,
    PRIORITY_VARIANT,
    STATUS_VARIANT,
} from "@/models/task";

interface TasksTableProps {
    tasks: Task[];
    loading: boolean;
    onView: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("ru-RU");
}

export default function TasksTable({ tasks, loading, onView, onEdit, onDelete }: TasksTableProps) {
    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-muted-foreground py-12 text-center">
                Заявки не найдены
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Тип</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead>Комната</TableHead>
                        <TableHead>Приоритет</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Исполнитель</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead className="w-[50px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id} className="cursor-pointer" onClick={() => onView(task)}>
                            <TableCell className="font-medium">{task.task_type}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{task.description}</TableCell>
                            <TableCell>{task.room_number || "—"}</TableCell>
                            <TableCell>
                                <Badge variant={PRIORITY_VARIANT[task.priority] ?? "secondary"}>
                                    {PRIORITY_LABELS[task.priority] ?? task.priority}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={STATUS_VARIANT[task.status] ?? "outline"}>
                                    {STATUS_LABELS[task.status] ?? task.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{task.assignee_name || "—"}</TableCell>
                            <TableCell>{formatDate(task.created_at)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon-sm">
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(task); }}>
                                            <Eye />
                                            Просмотр
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                                            <Pencil />
                                            Редактировать
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={(e) => { e.stopPropagation(); onDelete(task); }}
                                        >
                                            <Trash2 />
                                            Удалить
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
