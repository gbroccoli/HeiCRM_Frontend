import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { $api } from "@/api/axios";
import { Button } from "@/components/ui/button";
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
import type { UserProfile } from "@/models/user";
import type { PaginatedResponse } from "@/models/api";
import UsersTable from "./components/UsersTable";
import UserDeleteDialog from "./components/UserDeleteDialog";

const LIMIT = 20;

export default function AdminUsersPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null);

    const fetchUsers = useCallback(async (p: number) => {
        setLoading(true);
        try {
            const { data } = await $api.get<PaginatedResponse<UserProfile>>("/users/", {
                params: { page: p, page_size: LIMIT },
            });
            setUsers(data.data.items ?? []);
            setTotalPages(data.data.pagination.total_pages);
        } catch {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(page);
    }, [page, fetchUsers]);

    const handleEdit = (user: UserProfile) => {
        navigate(`${user.id}/edit`);
    };

    const handleDelete = (user: UserProfile) => {
        setDeleteUser(user);
        setDeleteOpen(true);
    };

    const handleDeleted = () => {
        fetchUsers(page);
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
                <h1 className="text-2xl font-bold tracking-tight">Пользователи</h1>
                <Button onClick={() => navigate("create")}>
                    <Plus />
                    Добавить пользователя
                </Button>
            </div>

            <UsersTable
                users={users}
                loading={loading}
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

            <UserDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                user={deleteUser}
                onDeleted={handleDeleted}
            />
        </div>
    );
}
