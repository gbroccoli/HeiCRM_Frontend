import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { $api } from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink,
    PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@/components/ui/pagination";
import { ArrowLeft, Plus } from "lucide-react";
import type { Room } from "@/models/room";
import type { Housing } from "@/models/housing";
import type { PaginatedResponse, ApiResponse } from "@/models/api";
import RoomsTable from "./components/RoomsTable";
import RoomDeleteDialog from "./components/RoomDeleteDialog";

const LIMIT = 20;

export default function AdminRoomsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [building, setBuilding] = useState<Housing | null>(null);
    const [items, setItems] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [floorFilter, setFloorFilter] = useState<string>("all");

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<Room | null>(null);

    useEffect(() => {
        $api.get<ApiResponse<Housing>>(`/housing/${id}`).then(({ data }) => {
            setBuilding(data.data);
        }).catch(() => {});
    }, [id]);

    const fetchItems = useCallback(async (p: number) => {
        setLoading(true);
        try {
            const params: Record<string, string | number> = { page: p, page_size: LIMIT };
            if (statusFilter !== "all") params.status = statusFilter;
            if (floorFilter !== "all") params.floor = Number(floorFilter);
            const { data } = await $api.get<PaginatedResponse<Room>>(`/housing/${id}/rooms`, { params });
            setItems(data.data.items ?? []);
            setTotalPages(data.data.pagination.total_pages);
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [id, statusFilter, floorFilter]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter, floorFilter]);

    useEffect(() => {
        fetchItems(page);
    }, [page, fetchItems]);

    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push("ellipsis");
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
            if (page < totalPages - 2) pages.push("ellipsis");
            pages.push(totalPages);
        }
        return pages;
    };

    const floors = building ? Array.from({ length: building.floors }, (_, i) => i + 1) : [];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin/housing")}>
                    <ArrowLeft />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Комнаты</h1>
                    {building && (
                        <p className="text-sm text-muted-foreground">{building.address}</p>
                    )}
                </div>
                <div className="ml-auto">
                    <Button onClick={() => navigate(`/dashboard/admin/housing/${id}/rooms/create`)}>
                        <Plus />
                        Добавить комнату
                    </Button>
                </div>
            </div>

            <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все статусы</SelectItem>
                        <SelectItem value="free">Свободные</SelectItem>
                        <SelectItem value="occupied">Занятые</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={floorFilter} onValueChange={setFloorFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Этаж" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все этажи</SelectItem>
                        {floors.map((f) => (
                            <SelectItem key={f} value={String(f)}>Этаж {f}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <RoomsTable
                items={items}
                loading={loading}
                onView={(item) => navigate(`/dashboard/admin/housing/${id}/rooms/${item.id}`)}
                onEdit={(item) => navigate(`/dashboard/admin/housing/${id}/rooms/${item.id}/edit`)}
                onDelete={(item) => { setDeleteItem(item); setDeleteOpen(true); }}
            />

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                        {getPageNumbers().map((p, i) =>
                            p === "ellipsis" ? (
                                <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
                            ) : (
                                <PaginationItem key={p}>
                                    <PaginationLink isActive={page === p} onClick={() => setPage(p)} className="cursor-pointer">
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            <RoomDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                buildingId={id!}
                room={deleteItem}
                onDeleted={() => fetchItems(page)}
            />
        </div>
    );
}
