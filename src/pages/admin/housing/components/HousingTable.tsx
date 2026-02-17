import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DoorOpen, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Housing } from "@/models/housing";

interface HousingTableProps {
    items: Housing[];
    loading: boolean;
    onEdit: (item: Housing) => void;
    onDelete: (item: Housing) => void;
    onRooms: (item: Housing) => void;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("ru-RU");
}

export default function HousingTable({ items, loading, onEdit, onDelete, onRooms }: HousingTableProps) {
    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-muted-foreground py-12 text-center">
                Здания не найдены
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Адрес</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead className="text-center">Этажей</TableHead>
                        <TableHead className="text-center">Комнат</TableHead>
                        <TableHead className="text-center">Жильцов</TableHead>
                        <TableHead>Дата создания</TableHead>
                        <TableHead className="w-[50px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.address}</TableCell>
                            <TableCell className="text-muted-foreground max-w-[200px] truncate">
                                {item.description || "—"}
                            </TableCell>
                            <TableCell className="text-center">{item.floors}</TableCell>
                            <TableCell className="text-center">{item.room_count}</TableCell>
                            <TableCell className="text-center">{item.resident_count}</TableCell>
                            <TableCell>{formatDate(item.created_at)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon-sm">
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onRooms(item)}>
                                            <DoorOpen />
                                            Комнаты
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEdit(item)}>
                                            <Pencil />
                                            Редактировать
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() => onDelete(item)}
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
