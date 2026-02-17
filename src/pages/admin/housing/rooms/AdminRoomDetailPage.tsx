import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { $api } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, ArrowRightLeft, MoreHorizontal, Pencil, Plus, Trash2, TriangleAlert } from "lucide-react";
import type { Room } from "@/models/room";
import type { Resident } from "@/models/resident";
import type { ApiResponse, PaginatedResponse } from "@/models/api";
import { formatDate } from "@/lib/utils";
import ResidentDeleteDialog from "./components/ResidentDeleteDialog";
import ResidentTransferDialog from "./components/ResidentTransferDialog";

const ROOM_TYPE_LABELS: Record<string, string> = {
    single: "Одноместная", double: "Двухместная", block: "Блок",
};

export default function AdminRoomDetailPage() {
    const { id, roomId } = useParams<{ id: string; roomId: string }>();
    const navigate = useNavigate();
    const [room, setRoom] = useState<Room | null>(null);
    const [residents, setResidents] = useState<Resident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteResident, setDeleteResident] = useState<Resident | null>(null);
    const [transferOpen, setTransferOpen] = useState(false);
    const [transferResident, setTransferResident] = useState<Resident | null>(null);

    const fetchRoom = useCallback(async () => {
        try {
            const { data } = await $api.get<ApiResponse<Room>>(`/housing/${id}/rooms/${roomId}`);
            setRoom(data.data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id, roomId]);

    const fetchResidents = useCallback(async () => {
        try {
            const { data } = await $api.get<PaginatedResponse<Resident>>(
                `/housing/${id}/rooms/${roomId}/residents`,
                { params: { page: 1, page_size: 100 } },
            );
            setResidents(data.data.items ?? []);
        } catch {
            setResidents([]);
        }
    }, [id, roomId]);

    useEffect(() => {
        fetchRoom();
        fetchResidents();
    }, [fetchRoom, fetchResidents]);

    const refresh = () => { fetchRoom(); fetchResidents(); };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/admin/housing/${id}/rooms`)}><ArrowLeft /></Button>
                    <h1 className="text-2xl font-bold tracking-tight">Комната</h1>
                </div>
                <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
                    <TriangleAlert className="size-10" />
                    <p>Не удалось загрузить комнату</p>
                    <Button variant="outline" onClick={() => navigate(`/dashboard/admin/housing/${id}/rooms`)}>Вернуться</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/admin/housing/${id}/rooms`)}><ArrowLeft /></Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Комната {room.room_number}</h1>
                    <p className="text-sm text-muted-foreground">
                        Этаж {room.floor} &middot; {ROOM_TYPE_LABELS[room.room_type] ?? room.room_type} &middot; Вместимость: {room.capacity}
                    </p>
                </div>
                <Badge className="ml-2" variant={room.status === "free" ? "secondary" : "default"}>
                    {room.status === "free" ? "Свободна" : "Занята"}
                </Badge>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Жильцы ({residents.length}/{room.capacity})</h2>
                <Button size="sm" onClick={() => navigate(`/dashboard/admin/housing/${id}/rooms/${roomId}/residents/create`)} disabled={residents.length >= room.capacity}>
                    <Plus />
                    Заселить
                </Button>
            </div>

            {residents.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">Жильцов нет</div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ФИО</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Телефон</TableHead>
                                <TableHead>Дата заселения</TableHead>
                                <TableHead>Дата выселения</TableHead>
                                <TableHead className="w-[50px]" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {residents.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium">{r.full_name}</TableCell>
                                    <TableCell>{r.email || "—"}</TableCell>
                                    <TableCell>{r.phone || "—"}</TableCell>
                                    <TableCell>{formatDate(r.move_in_date)}</TableCell>
                                    <TableCell>
                                        {r.move_out_date
                                            ? formatDate(r.move_out_date)
                                            : <Badge variant="secondary">Проживает</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon-sm">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/dashboard/admin/housing/${id}/rooms/${roomId}/residents/${r.id}/edit`)}>
                                                    <Pencil /> Редактировать
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { setTransferResident(r); setTransferOpen(true); }}>
                                                    <ArrowRightLeft /> Перевести
                                                </DropdownMenuItem>
                                                <DropdownMenuItem variant="destructive" onClick={() => { setDeleteResident(r); setDeleteOpen(true); }}>
                                                    <Trash2 /> Выселить
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <ResidentDeleteDialog
                open={deleteOpen} onOpenChange={setDeleteOpen}
                buildingId={id!} roomId={roomId!}
                resident={deleteResident} onDeleted={refresh}
            />
            <ResidentTransferDialog
                open={transferOpen} onOpenChange={setTransferOpen}
                buildingId={id!} roomId={roomId!}
                resident={transferResident} onTransferred={refresh}
            />
        </div>
    );
}
