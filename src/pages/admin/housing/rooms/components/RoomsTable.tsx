import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Room } from "@/models/room";

interface RoomsTableProps {
    items: Room[];
    loading: boolean;
    onView: (item: Room) => void;
    onEdit: (item: Room) => void;
    onDelete: (item: Room) => void;
}

const ROOM_TYPE_LABELS: Record<string, string> = {
    single: "Одноместная",
    double: "Двухместная",
    block: "Блок",
};

export default function RoomsTable({ items, loading, onView, onEdit, onDelete }: RoomsTableProps) {
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
                Комнаты не найдены
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Номер</TableHead>
                        <TableHead className="text-center">Этаж</TableHead>
                        <TableHead>Тип</TableHead>
                        <TableHead className="text-center">Вместимость</TableHead>
                        <TableHead className="text-center">Занято</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="w-[50px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id} className="cursor-pointer" onClick={() => onView(item)}>
                            <TableCell className="font-medium">{item.room_number}</TableCell>
                            <TableCell className="text-center">{item.floor}</TableCell>
                            <TableCell>{ROOM_TYPE_LABELS[item.room_type] ?? item.room_type}</TableCell>
                            <TableCell className="text-center">{item.capacity}</TableCell>
                            <TableCell className="text-center">{item.occupancy ?? 0}</TableCell>
                            <TableCell>
                                <Badge variant={item.status === "free" ? "secondary" : "default"}>
                                    {item.status === "free" ? "Свободна" : "Занята"}
                                </Badge>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon-sm">
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onView(item)}>
                                            <Eye />
                                            Подробнее
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEdit(item)}>
                                            <Pencil />
                                            Редактировать
                                        </DropdownMenuItem>
                                        <DropdownMenuItem variant="destructive" onClick={() => onDelete(item)}>
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
