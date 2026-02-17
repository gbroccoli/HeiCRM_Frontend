import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { $api } from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { Plus } from "lucide-react";
import type { Task, TaskStatus, TaskPriority } from "@/models/task";
import { STATUS_LABELS, PRIORITY_LABELS } from "@/models/task";
import type { PaginatedResponse } from "@/models/api";
import TasksTable from "./components/TasksTable";
import TaskDeleteDialog from "./components/TaskDeleteDialog";

const LIMIT = 20;

export default function AdminTasksPage() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTask, setDeleteTask] = useState<Task | null>(null);

    const fetchTasks = useCallback(async (p: number) => {
        setLoading(true);
        try {
            const params: Record<string, unknown> = { page: p, page_size: LIMIT };
            if (statusFilter !== "all") params.status = statusFilter;
            if (priorityFilter !== "all") params.priority = priorityFilter;

            const { data } = await $api.get<PaginatedResponse<Task>>("/tasks/", { params });
            setTasks(data.data.items ?? []);
            setTotalPages(data.data.pagination.total_pages);
        } catch {
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, priorityFilter]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter, priorityFilter]);

    useEffect(() => {
        fetchTasks(page);
    }, [page, fetchTasks]);

    const handleView = (task: Task) => {
        navigate(`${task.id}`);
    };

    const handleEdit = (task: Task) => {
        navigate(`${task.id}/edit`);
    };

    const handleDelete = (task: Task) => {
        setDeleteTask(task);
        setDeleteOpen(true);
    };

    const handleDeleted = () => {
        fetchTasks(page);
    };

    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push("ellipsis");
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pages.push(i);
            }
            if (page < totalPages - 2) pages.push("ellipsis");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Заявки</h1>
                <Button onClick={() => navigate("create")}>
                    <Plus />
                    Создать заявку
                </Button>
            </div>

            <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все статусы</SelectItem>
                        {(Object.entries(STATUS_LABELS) as [TaskStatus, string][]).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Приоритет" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все приоритеты</SelectItem>
                        {(Object.entries(PRIORITY_LABELS) as [TaskPriority, string][]).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <TasksTable
                tasks={tasks}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                aria-disabled={page === 1}
                                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                        {getPageNumbers().map((p, i) =>
                            p === "ellipsis" ? (
                                <PaginationItem key={`ellipsis-${i}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        isActive={page === p}
                                        onClick={() => setPage(p)}
                                        className="cursor-pointer"
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                aria-disabled={page === totalPages}
                                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            <TaskDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                task={deleteTask}
                onDeleted={handleDeleted}
            />
        </div>
    );
}
