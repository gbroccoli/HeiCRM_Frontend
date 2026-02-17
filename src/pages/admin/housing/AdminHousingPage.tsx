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
import type { Housing } from "@/models/housing";
import type { PaginatedResponse } from "@/models/api";
import HousingTable from "./components/HousingTable";
import HousingDeleteDialog from "./components/HousingDeleteDialog";

const LIMIT = 20;

export default function AdminHousingPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<Housing[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<Housing | null>(null);

    const fetchItems = useCallback(async (p: number) => {
        setLoading(true);
        try {
            const { data } = await $api.get<PaginatedResponse<Housing>>("/housing/", {
                params: { page: p, page_size: LIMIT },
            });
            setItems(data.data.items ?? []);
            setTotalPages(data.data.pagination.total_pages);
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems(page);
    }, [page, fetchItems]);

    const handleEdit = (item: Housing) => {
        navigate(`${item.id}/edit`);
    };

    const handleRooms = (item: Housing) => {
        navigate(`${item.id}/rooms`);
    };

    const handleDelete = (item: Housing) => {
        setDeleteItem(item);
        setDeleteOpen(true);
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
                <h1 className="text-2xl font-bold tracking-tight">Здания</h1>
                <Button onClick={() => navigate("create")}>
                    <Plus />
                    Добавить здание
                </Button>
            </div>

            <HousingTable
                items={items}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRooms={handleRooms}
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

            <HousingDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                item={deleteItem}
                onDeleted={() => fetchItems(page)}
            />
        </div>
    );
}
